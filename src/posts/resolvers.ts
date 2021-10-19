import { ObjectId } from "mongodb";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import { QueryResolvers, MutationResolvers, PostResolvers } from "../gen-types";
import { WithIndexSignature } from "Utils";
import { NotFoundError } from "../errors";

interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Post: PostResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async posts(parent, args, context) {
      const data = await context.db
        .collection("posts")
        .find()
        .toArray();
      return data;
    },
    async getPostById(parent, args, context) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db.collection("posts").findOne({ _id: objId });
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
        .find({ tagIds: mongoQueryValue })
        .toArray();

      if (!data) {
        throw new NotFoundError("Cannot find posts");
      }
      return data;
    },
    async search(parent, args, context) {
      const { searchTerm } = args;
      const data = await context.db
        .collection("posts")
        .aggregate([
          {
            $search: {
              index: "default",
              phrase: {
                query: searchTerm,
                slop: 4,
                path: {
                  wildcard: "*"
                }
              },
              highlight: {
                path: ["title", "content"]
              }
            }
          },
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
            $project: {
              _id: 1,
              title: 1,
              date: 1,
              content: 1,
              author: 1,
              authorInfo: 1,
              score: { $meta: "searchScore" },
              highlights: { $meta: "searchHighlights" }
            }
          }
        ])
        .toArray();
      return data;
    }
  },
  Mutation: {
    async createPost(parent, args, context) {
      const { title, content, tagIds } = args;
      const { isAuthed, userData } = context;
      // User not logged in
      if (!isAuthed) {
        throw new AuthenticationError("Unauthorized");
      }
      const tagObjectIds = tagIds.map(tag => new ObjectId(tag as string));
      // create new Post
      const newPost = {
        title,
        content,
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
        .findOne({ _id: dbRes.insertedId });
      if (!newPostData) {
        throw new NotFoundError("Cannot find post");
      }
      return newPostData;
    },

    async updatePost(parent, args, context) {
      const { _id, title, content, tagIds } = args;
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
      const dbRes = await db
        .collection("posts")
        .updateOne(
          { _id: objId },
          { $set: { title, content, tagIds: tagObjectIds } }
        );
      // Operation error
      if (dbRes.matchedCount !== 1 || dbRes.modifiedCount !== 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      // Update success
      const updatedPost = await context.db
        .collection("posts")
        .findOne({ _id: objId });
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
      return postToDelete;
    }
  },
  Post: {
    async authorInfo(post, args, context) {
      const { author } = post;
      const authorObject = await context.db
        .collection("users")
        .findOne({ _id: new ObjectId(author) });
      return authorObject;
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
      return tagObjects;
    }
  }
};

export default resolvers;
