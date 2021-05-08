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
      return data;
    }
  },
  Mutation: {
    async createPost(parent, args, context) {
      const { title, content } = args;
      const { isAuthed, userData } = context;

      if (isAuthed) {
        // create new Post
        const newPost = {
          title,
          content,
          _id: new ObjectId(),
          author: userData.userId,
          date: new Date().toISOString()
        };

        const dbRes = await context.db.collection("posts").insertOne(newPost);
        const newPostData = dbRes.ops[0];
        return newPostData;
      }
      // todo: add error
      console.log("UNAUTHORIZED");
    }
    // async updatePost(parent, args, context) {},
    // async deletePost(parent, args, context) {}
  }
};

export default resolvers;
