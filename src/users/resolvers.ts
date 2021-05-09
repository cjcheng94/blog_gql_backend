import { default as mongodb } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { QueryResolvers, UserResolvers } from "../gen-types";
import { WithIndexSignature } from "Utils";
import dotenv from "dotenv";
dotenv.config();

const { ObjectId } = mongodb;
interface Resolvers extends WithIndexSignature {
  Query: QueryResolvers;
  User: UserResolvers;
}

const resolvers: Resolvers = {
  Query: {
    async users(parent, args, context) {
      try {
        const data = await context.db
          .collection("users")
          .find()
          .toArray();
        return data;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    },
    async user(parent, args, context) {
      const { username } = args;
      try {
        const data = await context.db.collection("users").findOne({ username });
        // cannot find user
        if (data === null) {
          console.log("Error, cannot find user");
          return;
        }
        return data;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    },
    async userLogin(parent, args, context) {
      const { username, password } = args;
      const { db } = context;

      try {
        const targetUser = await db.collection("users").findOne({ username });

        // cannot find user
        if (targetUser === null) {
          console.log("Error, cannot find user");
          return;
        }

        // Found user, use bcrypt to compare passwords
        const result = await bcrypt.compare(password, targetUser.password);

        // Wrong password
        if (!result) {
          console.log("Error, auth failed");
          return;
        }

        const token = jwt.sign(
          {
            username: targetUser.username,
            userId: targetUser._id
          },
          process.env.JWT_KEY as string,
          { expiresIn: "2 days" }
        );

        // Success, grant token
        return token;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    }
  },
  User: {
    async posts(user, args, context) {
      const { posts, _id } = user;
      // User has no posts
      if (!posts || posts.length < 1) {
        return [];
      }
      try {
        const userObjId = new ObjectId(_id);
        const data = await context.db
          .collection("posts")
          .find({ author: userObjId })
          .toArray();
        return data;
      } catch (err) {
        console.log("Error, database error");
        return;
      }
    }
  }
};

export default resolvers;
