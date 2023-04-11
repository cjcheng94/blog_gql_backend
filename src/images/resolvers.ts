import { ObjectId } from "mongodb";
import { QueryResolvers, MutationResolvers } from "../gen-types";
import { IResolvers } from "graphql-tools";
import { WithIndex } from "../../typings/typings.js";
import { NotFoundError, ForbiddenError } from "../errors/index.js";
import dotenv from "dotenv";

dotenv.config();

interface Resolvers {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
}

const resolvers: WithIndex<IResolvers & Resolvers> = {
  Query: {
    async image(parent, args, context) {
      const { _id } = args;
      const objId = new ObjectId(_id);
      const data = await context.db
        .collection("images")
        .findOne({ _id: objId });
      // cannot find image
      if (!data) {
        throw new NotFoundError("Cannot find image");
      }
      return data;
    }
  },
  Mutation: {
    async createImage(parent, args, context) {
      const { caption } = args;
      const { isAdmin, db } = context;
      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }
      const newImage = {
        _id: new ObjectId(),
        caption
      };
      const dbRes = await db.collection("images").insertOne(newImage);
      // Error creating image
      if (!dbRes.insertedId) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      const newImageData = await db
        .collection("images")
        .findOne({ _id: dbRes.insertedId });
      if (!newImageData) {
        throw new NotFoundError("Cannot find image");
      }
      return newImageData;
    },
    async updateImage(parent, args, context) {
      const { _id, caption } = args;
      const { isAdmin, userData, db } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      // Find to-be-updated image by id
      const objId = new ObjectId(_id);
      const imageToUpdate = await db
        .collection("images")
        .findOne({ _id: objId });
      // Cannot find such image
      if (!imageToUpdate) {
        throw new NotFoundError("Cannot find image");
      }

      const dbRes = await db
        .collection("images")
        .updateOne({ _id: objId }, { $set: { caption } });

      // Operation error
      if (dbRes.matchedCount !== 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }

      // Update success
      const updatedImage = await db
        .collection("images")
        .findOne({ _id: objId });
      // Cannot find such image
      if (!updatedImage) {
        throw new NotFoundError("Cannot find updated image");
      }
      // All done, return updated image
      return updatedImage;
    },
    async deleteImage(parent, args, context) {
      const { _id } = args;
      const { isAdmin, userData, db } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      // Find to-be-deleted image by id
      const objId = new ObjectId(_id);
      const imageToDelete = await db
        .collection("images")
        .findOne({ _id: objId });
      // Cannot find such image
      if (!imageToDelete) {
        throw new NotFoundError("Cannot find image");
      }

      // Delete this image
      const dbRes = await db.collection("images").deleteOne({ _id: objId });
      // Operation error(e.g.cant find image)
      if (dbRes.deletedCount < 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }
      return imageToDelete;
    }
  }
};

export default resolvers;
