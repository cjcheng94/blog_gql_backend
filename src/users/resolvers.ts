import { default as mongodb } from "mongodb";
import { IResolverObject } from "apollo-server";

const { ObjectId } = mongodb;

const resolvers: IResolverObject = {
  Query: {
    async users(parent: any, args: any, context: any, info: any) {
      const data = await context.db.collection("users").find().toArray();
      return data;
    }
  }
};

export default resolvers;
