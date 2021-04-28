import { ApolloServer, gql } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import { default as mongodb } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const { MongoClient } = mongodb;

import * as posts from "./posts/index.js";
import * as users from "./users/index.js";

const typeDef = gql`
  type Query
`;

const schema = makeExecutableSchema({
  typeDefs: [typeDef, posts.typeDefs, users.typeDefs],
  resolvers: [posts.resolvers, users.resolvers]
});

let db;
const apolloServer = new ApolloServer({
  schema,
  context: async () => {
    if (!db) {
      try {
        const dbClient = new MongoClient(process.env.MONGO_DB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        if (!dbClient.isConnected()) await dbClient.connect();
        db = dbClient.db("node_rest_api_blog");
        console.log("Database connected👌");
      } catch (e) {
        console.log("--->error while connecting with graphql context (db)", e);
      }
    }
    return { db };
  }
});

apolloServer.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
