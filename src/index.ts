import { ApolloServer, gql } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import { default as mongodb, Db } from "mongodb";
import dotenv from "dotenv";
import * as posts from "./posts";
import * as users from "./users";
const { MongoClient } = mongodb;
dotenv.config();

const typeDef = gql`
  type Query
`;

const schema = makeExecutableSchema({
  typeDefs: [typeDef, posts.typeDefs, users.typeDefs],
  resolvers: [posts.resolvers, users.resolvers]
});

let db: Db | undefined;
const apolloServer = new ApolloServer({
  schema,
  context: async () => {
    if (!db) {
      try {
        const dbClient = new MongoClient(process.env.MONGO_DB_URI as string, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        if (!dbClient.isConnected()) await dbClient.connect();
        db = dbClient.db("node_rest_api_blog");
        console.log("Database connected👌");
      } catch (e) {
        console.log("Error while connecting to database😔", e);
      }
    }
    return { db };
  }
});

apolloServer.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
