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
        .aggregate([
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
          }
        ])
        .toArray();
      return data;
    },
    async getPostById(parent, args, context) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db.collection("posts").findOne({ _id: objId });
      if (data === null) {
        throw new NotFoundError("Cannot find post");
      }
      // Find corresponding User object using the user id "author"
      const authorObject = await context.db
        .collection("users")
        .findOne({ _id: new ObjectId(data.author) });
      // cannot find user
      if (authorObject === null) {
        throw new NotFoundError("Cannot find user");
      }
      // Replace old user id with user object
      data.authorInfo = authorObject;
      return data;
    }
  },
  Mutation: {
    async createPost(parent, args, context) {
      const { title, content } = args;
      const { isAuthed, userData } = context;
      // User not logged in
      if (!isAuthed) {
        throw new AuthenticationError("Unauthorized");
      }
      // create new Post
      const newPost = {
        title,
        content,
        _id: new ObjectId(),
        author: new ObjectId(userData.userId),
        date: new Date().toISOString()
      };
      const dbRes = await context.db.collection("posts").insertOne(newPost);
      const newPostData = dbRes.ops[0];
      return newPostData;
    },

    async updatePost(parent, args, context) {
      const { _id, title, content } = args;
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
      if (postToUpdate === null) {
        throw new NotFoundError("Cannot find post");
      }
      const postOwner = postToUpdate.author;
      // Not your post
      if (postOwner !== userData.userId) {
        throw new ForbiddenError("Forbidden, not your post");
      }
      // update post
      const dbRes = await db
        .collection("posts")
        .updateOne({ _id: objId }, { $set: { title, content } });
      // Operation error
      if (dbRes.matchedCount !== 1 || dbRes.modifiedCount !== 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      // Update success
      const updatedPost = await context.db
        .collection("posts")
        .findOne({ _id: objId });
      // Cannot find such a post
      if (updatedPost === null) {
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
      if (postToDelete === null) {
        throw new NotFoundError("Cannot find post");
      }
      const postOwner = postToDelete.author;
      // Not your post
      if (postOwner !== userData.userId) {
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
    }
  }
};

export default resolvers;
