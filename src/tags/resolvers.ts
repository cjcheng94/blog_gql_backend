import { ObjectId } from "mongodb";
import { QueryResolvers, MutationResolvers } from "../gen-types";
import { WithIndexSignature } from "Utils";
import { NotFoundError } from "../errors";
import dotenv from "dotenv";
dotenv.config();
interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async tags(parent, args, context) {
      const data = await context.db
        .collection("tags")
        .find()
        .toArray();
      return data;
    },
    async tag(parent, args, context) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db.collection("tags").findOne({ _id: objId });
      // cannot find tag
      if (!data) {
        throw new NotFoundError("Cannot find tag");
      }
      return data;
    }
  },
  Mutation: {
    async createTag(parent, args, context) {
      const { name } = args;
      const newTag = {
        _id: new ObjectId(),
        name
      };
      const dbRes = await context.db.collection("tags").insertOne(newTag);
      // Error creating tag
      if (!dbRes.insertedId) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      const newTagData = await context.db
        .collection("tags")
        .findOne({ _id: dbRes.insertedId });
      if (!newTagData) {
        throw new NotFoundError("Cannot find post");
      }
      return newTagData;
    }
  }
};

export default resolvers;
