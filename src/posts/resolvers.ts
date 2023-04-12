import { ObjectId } from "mongodb";
import {
  QueryResolvers,
  MutationResolvers,
  PostResolvers,
  Post,
  PostSearchResult,
  User,
  Tag,
  PostsResponse
} from "../gen-types";
import { IResolvers } from "graphql-tools";
import { WithIndex } from "../../typings/typings";

import {
  NotFoundError,
  AuthenticationError,
  ForbiddenError
} from "../errors/index.js";

import {
  transformDataToEdges,
  edgesToReturn,
  isHasNextPage
} from "../utils/pagination.js";

type Resolvers = {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Post: PostResolvers;
};

const resolvers: WithIndex<IResolvers & Resolvers> = {
  Query: {
    async posts(parent, args, context) {
      // first is the number of edges that the consumer requested
      // after is the cursor after which we start slicing our edges
      const { first, after } = args;

      const data = await context.db.collection<Post>("posts").find().toArray();
      const latestFirstData = data.sort(
        (a, b) => Date.parse(b.date) - Date.parse(a.date)
      );

      const allEdges = transformDataToEdges(latestFirstData, "_id");

      const edges = edgesToReturn({
        allEdges,
        after,
        first
      });

      const hasNextPage = isHasNextPage({
        allEdges,
        after,
        first
      });

      // The cursor of the last element in edges.
      // API consumers can then use this cursor
      // to request number of elements after this element
      const endCursor = edges.at(-1)?.cursor;

      return {
        edges,
        pageInfo: {
          endCursor,
          hasNextPage
        }
      } as PostsResponse;
    },
    async getPostById(parent, args, context) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db
        .collection("posts")
        .findOne<Post>({ _id: objId });
      if (!data) {
        throw new NotFoundError("Cannot find post");
      }
      return data;
    },
    async getPostsByTags(parent, args, context) {
      const { tagIds } = args;
      let mongoQueryValue;

      // We need to use <arrayField: element> expression when tagIds has ONE element
      if (tagIds.length <= 1 && tagIds[0]) {
        const tagObjectId = new ObjectId(tagIds[0]);
        mongoQueryValue = tagObjectId;
      } else {
        // Use $all expression to query multiple tagIds
        const tagObjectIds: ObjectId[] = [];
        tagIds.forEach(id => {
          if (!id) return;
          const objId = new ObjectId(id);
          tagObjectIds.push(objId);
        });
        mongoQueryValue = { $all: tagObjectIds };
      }

      const data = await context.db
        .collection("posts")
        .find<Post>({ tagIds: mongoQueryValue })
        .toArray();

      if (!data) {
        throw new NotFoundError("Cannot find posts");
      }
      return data;
    },
    async search(parent, args, context) {
      const { searchTerm, tagIds } = args;
      const tagObjectIds: ObjectId[] = [];

      // tagIds is valid and not empty
      const tagIdsNotEmpty = !!tagIds && tagIds.length > 0;

      // Construct objectIds for tagids
      if (tagIdsNotEmpty) {
        tagIds!.forEach(id => {
          if (!id) return;
          tagObjectIds.push(new ObjectId(id));
        });
      }

      const data = await context.db
        .collection("posts")
        .aggregate([
          {
            $search: {
              index: "default",
              phrase: {
                query: searchTerm,
                slop: 4,
                path: "contentText"
              },
              highlight: {
                path: ["title", "content"]
              }
            }
          },
          // Include tags stage IF NON-EMPTY tagIds array is provided
          ...(tagIdsNotEmpty
            ? [
                {
                  $match: {
                    tagIds: { $all: tagObjectIds }
                  }
                }
              ]
            : []),
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "authorInfo"
            }
          },
          {
            $unwind: "$authorInfo"
          },
          {
            $lookup: {
              from: "tags",
              localField: "tagIds",
              foreignField: "_id",
              as: "tags"
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              date: 1,
              content: 1,
              contentText: 1,
              author: 1,
              authorInfo: 1,
              tagIds: 1,
              tags: 1,
              thumbnailUrl: 1,
              score: { $meta: "searchScore" },
              highlights: { $meta: "searchHighlights" }
            }
          }
        ])
        .toArray();
      return data as PostSearchResult[];
    }
  },
  Mutation: {
    async createPost(parent, args, context) {
      const { title, content, contentText, tagIds, thumbnailUrl } = args;
      const { isAuthed, isAdmin, userData } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      // User not logged in
      if (!isAuthed) {
        throw new AuthenticationError("Unauthorized");
      }
      const tagObjectIds = tagIds.map(tag => new ObjectId(tag as string));
      // create new Post
      const newPost = {
        title,
        content,
        contentText,
        thumbnailUrl,
        tagIds: tagObjectIds,
        _id: new ObjectId(),
        author: new ObjectId(userData.userId),
        date: new Date().toISOString()
      };
      const dbRes = await context.db.collection("posts").insertOne(newPost);

      // Error creating post
      if (!dbRes.insertedId) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      const newPostData = await context.db
        .collection("posts")
        .findOne<Post>({ _id: dbRes.insertedId });
      if (!newPostData) {
        throw new NotFoundError("Cannot find post");
      }
      return newPostData;
    },

    async updatePost(parent, args, context) {
      const { _id, title, content, contentText, tagIds, thumbnailUrl } = args;
      const { isAuthed, userData, db } = context;
      // User not logged in
      if (!isAuthed) {
        throw new AuthenticationError("Unauthorized");
      }
      // Find to-be-updated post by id and its owner
      const objId = new ObjectId(_id);
      const postToUpdate = await context.db
        .collection("posts")
        .findOne({ _id: objId });
      // Cannot find such a post
      if (!postToUpdate) {
        throw new NotFoundError("Cannot find post");
      }
      const postOwnerId = postToUpdate.author.toHexString();
      const userId = new ObjectId(userData.userId).toHexString();
      // Not your post
      if (postOwnerId !== userId) {
        throw new ForbiddenError("Forbidden, not your post");
      }
      const tagObjectIds = tagIds.map(tag => new ObjectId(tag as string));
      // update post
      const dbRes = await db.collection("posts").updateOne(
        { _id: objId },
        {
          $set: {
            title,
            content,
            contentText,
            thumbnailUrl,
            tagIds: tagObjectIds
          }
        }
      );
      // Operation error
      if (dbRes.matchedCount !== 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      // Update success
      const updatedPost = await context.db
        .collection("posts")
        .findOne<Post>({ _id: objId });
      // Cannot find such post
      if (!updatedPost) {
        throw new NotFoundError("Cannot find updated post");
      }
      // All done, return updated post
      return updatedPost;
    },

    async deletePost(parent, args, context) {
      const { _id } = args;
      const { isAuthed, userData, db } = context;
      // User not logged in
      if (!isAuthed) {
        throw new AuthenticationError("Unauthorized");
      }
      const objId = new ObjectId(_id);
      const postToDelete = await context.db
        .collection("posts")
        .findOne({ _id: objId });

      // Cannot find such a post
      if (!postToDelete) {
        throw new NotFoundError("Cannot find post");
      }
      const postOwnerId = postToDelete.author.toHexString();
      const userId = new ObjectId(userData.userId).toHexString();
      // Not your post
      if (postOwnerId !== userId) {
        throw new ForbiddenError("Forbidden, not your post");
      }
      // Delete post
      const dbRes = await db.collection("posts").deleteOne({ _id: objId });
      // Operation error(e.g.cant find post)
      if (dbRes.deletedCount < 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      // Deleted successfully
      return postToDelete as Post;
    }
  },
  Post: {
    async authorInfo(post, args, context) {
      const { author } = post;
      const authorObject = await context.db
        .collection("users")
        .findOne({ _id: new ObjectId(author) });

      return authorObject as User;
    },
    async tags(post, args, context) {
      const { tagIds } = post;
      if (tagIds.length < 1) {
        return [];
      }
      const tagObjects = await Promise.all(
        tagIds.map(
          async tagId =>
            await context.db
              .collection("tags")
              .findOne({ _id: new ObjectId(tagId as string) })
        )
      );
      return tagObjects as Tag[];
    }
  }
};

export default resolvers;
