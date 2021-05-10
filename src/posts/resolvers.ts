import { default as mongodb } from "mongodb";
import { QueryResolvers, MutationResolvers } from "../gen-types";
import { WithIndexSignature } from "Utils";

const { ObjectId } = mongodb;

interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async posts(parent, args, context) {
      try {
        const data = await context.db
          .collection("posts")
          .find()
          .toArray();
        return data;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    },
    async getPostById(parent, args, context) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      try {
        const data = await context.db
          .collection("posts")
          .findOne({ _id: objId });

        if (data === null) {
          console.log("Error, cannot find post");
          return;
        }

        return data;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    }
  },
  Mutation: {
    async createPost(parent, args, context) {
      const { title, content } = args;
      const { isAuthed, userData } = context;

      // User not logged in
      if (!isAuthed) {
        console.log("Error, unauthorized");
        return;
      }

      // create new Post
      const newPost = {
        title,
        content,
        _id: new ObjectId(),
        author: new ObjectId(userData.userId),
        date: new Date().toISOString()
      };

      try {
        const dbRes = await context.db.collection("posts").insertOne(newPost);
        const newPostData = dbRes.ops[0];
        return newPostData;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    },
    async updatePost(parent, args, context) {
      const { _id, title, content } = args;
      const { isAuthed, userData, db } = context;

      // User not logged in
      if (!isAuthed) {
        console.log("Error, unauthorized");
        return;
      }

      // Find to-be-updated post by id and its owner
      const objId = new ObjectId(_id);
      const postToUpdate = await context.db
        .collection("posts")
        .findOne({ _id: objId });

      // Cannot find such a post
      if (postToUpdate === null) {
        console.log("Error, cannot find updated post");
        return;
      }

      const postOwner = postToUpdate.author;

      // Not your post
      if (postOwner !== userData.userId) {
        console.log("Error, not your post");
        return;
      }

      // update post
      try {
        const dbRes = await db
          .collection("posts")
          .updateOne({ _id: objId }, { $set: { title, content } });

        // Operation error
        if (dbRes.matchedCount !== 1 || dbRes.modifiedCount !== 1) {
          console.log("Error, operation error");
          return;
        }

        // update success
        const updatedPost = await context.db
          .collection("posts")
          .findOne({ _id: objId });

        // Cannot find such a post
        if (updatedPost === null) {
          console.log("Error, cannot find updated post");
          return;
        }
        // All done, return updated post
        return updatedPost;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    },
    async deletePost(parent, args, context) {
      const { _id } = args;
      const { isAuthed, userData, db } = context;

      // User not logged in
      if (!isAuthed) {
        console.log("Error, unauthorized");
        return;
      }

      const objId = new ObjectId(_id);
      const postToDelete = await context.db
        .collection("posts")
        .findOne({ _id: objId });

      // Cannot find such a post
      if (postToDelete === null) {
        console.log("Error, Cannot find post");
        return;
      }

      const postOwner = postToDelete.author;

      // Not your post
      if (postOwner !== userData.userId) {
        console.log("Error, not your post");
        return;
      }

      // Delete post
      try {
        const dbRes = await db.collection("posts").deleteOne({ _id: objId });
        // Operation error(e.g.cant find post)
        if (dbRes.deletedCount < 1) {
          console.log("Error, operation error");
          return;
        }
        // Deleted successfully
        return postToDelete;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    }
  }
};

export default resolvers;
