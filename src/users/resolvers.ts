import { default as mongodb } from "mongodb";
import { QueryResolvers, UserResolvers } from "../gen-types";
import { WithIndexSignature } from "Utils";

const { ObjectId } = mongodb;
interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
  User: UserResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async users(parent, args, context) {
      const data = await context.db
        .collection("users")
        .find()
        .toArray();
      return data;
    },
    async user(parent, args, context) {
      const { username } = args;
      const data = await context.db.collection("users").findOne({ username });
      return data;
    }
  },
  User: {
    async posts(user, args, context) {
      const { posts } = user;
      if (!posts || posts.length < 1) {
        return [];
      }

      const data = await context.db
        .collection("posts")
        .find({ _id: { $in: posts } })
        .toArray();
      return data;
    }
  }
};

export default resolvers;
