import { default as mongodb } from "mongodb";
import { IResolverObject } from "apollo-server";

const { ObjectId } = mongodb;

const resolvers: IResolverObject = {
  Query: {
    async posts(parent: any, args: any, context: any) {
      const data = await context.db.collection("posts").find().toArray();
      return data;
    },
    async getPostById(parent: any, args: { _id: string }, context: any) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db.collection("posts").findOne({ _id: objId });
      return data;
    }
  }
};

export default resolvers;
