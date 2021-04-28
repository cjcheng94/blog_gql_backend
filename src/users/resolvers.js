import { default as mongodb } from "mongodb";
const { ObjectId } = mongodb;

const resolvers = {
  Query: {
    async users(parent, args, context, info) {
      const data = await context.db.collection("users").find().toArray();
      return data;
    }
  }
};

export default resolvers;
