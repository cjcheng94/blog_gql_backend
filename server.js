import { ApolloServer, gql } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import { default as mongodb } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MongoClient = mongodb.MongoClient;

const typeDefs = gql`
  type Query {
    posts: [Post]
    users: [User]!
  }
  type Post {
    _id: ID!
    title: String!
    author: String!
    content: String!
    date: String!
  }
  type User {
    _id: ID!
    posts: [ID!]
    username: String!
    password: String
  }
`;

const resolvers = {
  Query: {
    async posts(_parent, _args, _context, _info) {
      const data = await _context.db.collection("posts").find().toArray();
      return data;
    },
    users(_parent, _args, _context, _info) {
      const data = _context.db.collection("users").find().toArray();
      return data;
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
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
