import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import { makeExecutableSchema } from "graphql-tools";
import { MongoClient, Db, ObjectId } from "mongodb";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import * as posts from "./posts";
import * as users from "./users";
import * as tags from "./tags";
import * as drafts from "./drafts";
import * as images from "./images";

dotenv.config();

type DecodedToken = {
  username: string;
  userId: string;
  iat: number;
  exp: number;
};

const typeDef = gql`
  type Query
  type Mutation
`;

const schema = makeExecutableSchema({
  typeDefs: [
    typeDef,
    posts.typeDefs,
    users.typeDefs,
    tags.typeDefs,
    drafts.typeDefs,
    images.typeDefs
  ],
  resolvers: [
    posts.resolvers,
    users.resolvers,
    tags.resolvers,
    drafts.resolvers,
    images.resolvers
  ]
});

let db: Db | undefined;
const server = new ApolloServer({
  typeDefs: [
    typeDef,
    posts.typeDefs,
    users.typeDefs,
    tags.typeDefs,
    drafts.typeDefs,
    images.typeDefs
  ],
  resolvers: [
    posts.resolvers,
    users.resolvers,
    tags.resolvers,
    drafts.resolvers,
    images.resolvers
  ]
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    // Connect to database
    if (!db) {
      try {
        const dbClient = new MongoClient(process.env.MONGO_DB_URI as string);
        await dbClient.connect();
        db = dbClient.db("node_rest_api_blog");
        console.log("Database connected👌");
      } catch (e) {
        console.log("Error while connecting to database😔", e);
      }
    }
    // User auth
    let token = "";
    let userData = null;
    let isAuthed = false;
    let isAdmin = false;

    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = <DecodedToken>(
          jwt.verify(token, process.env.JWT_KEY as string)
        );
        isAuthed = true;
        userData = decoded;

        const userId = new ObjectId(userData.userId).toHexString();
        const adminId = new ObjectId(process.env.ADMIN_ID).toHexString();
        isAdmin = userId === adminId;
      } catch (err) {
        console.log("Auth failed");
      }
    }

    return { db, userData, isAuthed, isAdmin };
  },
  listen: { port: 4000 }
});

console.log(`🚀  Server ready at ${url}`);
