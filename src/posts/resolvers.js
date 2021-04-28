import { default as mongodb } from "mongodb";
const { ObjectId } = mongodb;

const resolvers = {
  Query: {
    async posts(parent, args, context, info) {
      const data = await context.db.collection("posts").find().toArray();
      return data;
    },
    async getPostById(parent, args, context, info) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db.collection("posts").findOne({ _id: objId });
      return data;
    }
  }
};

export default resolvers;
