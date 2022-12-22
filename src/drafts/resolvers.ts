import { ObjectId } from "mongodb";
import { AuthenticationError, ForbiddenError } from "apollo-server";
import {
  QueryResolvers,
  MutationResolvers,
  DraftResolvers
} from "../gen-types";
import { WithIndexSignature } from "Utils";
import { NotFoundError } from "../errors";

interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Draft: DraftResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async getDraftById(parent, args, context) {
      const { _id } = args;
      const { db, isAdmin, userData } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      // Find Draft
      const objId = new ObjectId(_id);
      const data = await db.collection("drafts").findOne({ _id: objId });

      if (!data) {
        throw new NotFoundError("Cannot find draft");
      }

      // Check User Credentials
      const userId = new ObjectId(userData.userId).toHexString();
      const draftOwnerId = data.author.toHexString();

      if (userId !== draftOwnerId) {
        throw new ForbiddenError("Forbidden, not your draft");
      }

      return data;
    },
    async getUserDrafts(parent, args, context) {
      const { db, isAdmin, userData } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      // Get User Id
      const userId = new ObjectId(userData.userId);

      // Get drafts
      const data = await db
        .collection("drafts")
        .find({ author: userId })
        .toArray();

      if (!data) {
        throw new NotFoundError("Cannot find draft");
      }

      return data;
    },
    async getDraftByPostId(parent, args, context) {
      const { postId } = args;
      const { db, isAdmin, userData } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      // Find Draft
      const postObjId = new ObjectId(postId);
      const data = await db.collection("drafts").findOne({ postId: postObjId });

      if (!data) {
        throw new NotFoundError("Cannot find draft");
      }

      // Check User Credentials
      const userId = new ObjectId(userData.userId).toHexString();
      const draftOwnerId = data.author.toHexString();

      if (userId !== draftOwnerId) {
        throw new ForbiddenError("Forbidden, not your draft");
      }

      return data;
    }
  },
  Mutation: {
    async createDraft(parent, args, context) {
      const {
        postId,
        title,
        content,
        contentText,
        tagIds,
        thumbnailUrl
      } = args;
      const { db, isAdmin, userData } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      // Construct new Draft object
      const tagObjectIds = tagIds.map(tag => new ObjectId(tag as string));
      const newDraft = {
        postId: postId ? new ObjectId(postId) : null,
        title,
        content,
        contentText,
        thumbnailUrl,
        tagIds: tagObjectIds,
        _id: new ObjectId(),
        author: new ObjectId(userData.userId),
        date: new Date().toISOString()
      };

      // Insert in DB
      const dbRes = await db.collection("drafts").insertOne(newDraft);

      // Error creating draft
      if (!dbRes.insertedId) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }

      const newDraftData = await db
        .collection("drafts")
        .findOne({ _id: dbRes.insertedId });

      if (!newDraftData) {
        throw new NotFoundError("Cannot find draft");
      }

      return newDraftData;
    },
    async updateDraft(parent, args, context) {
      const {
        _id,
        postId,
        title,
        content,
        contentText,
        tagIds,
        thumbnailUrl
      } = args;
      const { db, isAdmin, userData } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }
      // Find to-be-updated draft by id and its owner
      const objId = new ObjectId(_id);
      const draftToUpdate = await db
        .collection("drafts")
        .findOne({ _id: objId });

      // Cannot find such a draft
      if (!draftToUpdate) {
        throw new NotFoundError("Cannot find draft");
      }

      const draftOwnerId = draftToUpdate.author.toHexString();
      const userId = new ObjectId(userData.userId).toHexString();
      // Not your draft
      if (draftOwnerId !== userId) {
        throw new ForbiddenError("Forbidden, not your draft");
      }

      const tagObjectIds = tagIds.map(tag => new ObjectId(tag as string));
      // update draft
      const dbRes = await db.collection("drafts").updateOne(
        { _id: objId },
        {
          $set: {
            postId: postId ? new ObjectId(postId) : null,
            title,
            content,
            contentText,
            thumbnailUrl,
            tagIds: tagObjectIds,
            date: new Date().toISOString()
          }
        }
      );

      // Operation error
      if (dbRes.matchedCount !== 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }

      // Update success
      const updatedDraft = await db
        .collection("drafts")
        .findOne({ _id: objId });

      // Cannot find such draft
      if (!updatedDraft) {
        throw new NotFoundError("Cannot find updated draft");
      }

      // All done, return updated draft
      return updatedDraft;
    },
    async deleteDraft(parent, args, context) {
      const { _id } = args;
      const { db, isAdmin, userData } = context;

      // Admin-only
      if (!isAdmin) {
        throw new ForbiddenError("Forbidden, not admin");
      }

      const objId = new ObjectId(_id);
      const draftToDelete = await db
        .collection("drafts")
        .findOne({ _id: objId });

      // Cannot find such draft
      if (!draftToDelete) {
        throw new NotFoundError("Cannot find this draft");
      }

      const draftOwnerId = draftToDelete.author.toHexString();
      const userId = new ObjectId(userData.userId).toHexString();
      // Not your draft
      if (draftOwnerId !== userId) {
        throw new ForbiddenError("Forbidden, not your draft");
      }

      // Delete draft
      const dbRes = await db.collection("drafts").deleteOne({ _id: objId });

      // Operation error(e.g.cant find draft)
      if (dbRes.deletedCount < 1) {
        // Effectively INTERNAL_SERVER_ERROR type
        throw new Error("Internal server error");
      }

      // Deleted successfully
      return draftToDelete;
    }
  },
  Draft: {
    async tags(draft, args, context) {
      const { tagIds } = draft;
      if (tagIds.length < 1) {
        return [];
      }
      const tagObjects = await Promise.all(
        tagIds.map(
          async tagId =>
            await context.db
              .collection("tags")
              .findOne({ _id: new ObjectId(tagId as string) })
        )
      );
      return tagObjects;
    }
  }
};

export default resolvers;
