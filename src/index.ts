import { ApolloServer, gql } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import * as posts from "./posts";
import * as users from "./users";
import * as tags from "./tags";
import * as drafts from "./drafts";

dotenv.config();

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
    drafts.typeDefs
  ],
  resolvers: [
    posts.resolvers,
    users.resolvers,
    tags.resolvers,
    drafts.resolvers
  ]
});

let db: Db | undefined;
const apolloServer = new ApolloServer({
  schema,
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

    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_KEY as string);
        isAuthed = true;
        userData = decoded;
      } catch (err) {
        console.log("Auth failed");
      }
    }

    return { db, isAuthed, userData };
  },
  formatResponse: (response, requestContext) => {
    if (
      !requestContext.response ||
      !requestContext.response.http ||
      !requestContext.operation
    ) {
      return null;
    }
    // Add X-Is-Cacheable header to "query" type requests
    const isCacheable = requestContext.operation.operation === "query";
    if (isCacheable) {
      requestContext.response.http.headers.set("X-Is-Cacheable", "true");
      return response;
    }
    return null;
  }
});

apolloServer.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
