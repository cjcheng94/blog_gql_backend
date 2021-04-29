import { default as mongodb } from "mongodb";
import { QueryResolvers } from "../gen-types";
import { WithIndexSignature } from "Utils";

const { ObjectId } = mongodb;

interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async posts(parent, args, context) {
      const data = await context.db.collection("posts").find().toArray();
      return data;
    },
    async getPostById(parent, args, context) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db.collection("posts").findOne({ _id: objId });
      return data;
    }
  }
};

export default resolvers;
