import { default as mongodb } from "mongodb";
import { QueryResolvers } from "../gen-types";
import { WithIndexSignature } from "Utils";

const { ObjectId } = mongodb;
interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async users(parent, args, context, info) {
      const data = await context.db.collection("users").find().toArray();
      return data;
    }
  }
};

export default resolvers;
