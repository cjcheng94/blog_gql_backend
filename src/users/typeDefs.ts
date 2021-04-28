import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    users: [User]
    user(_id: ID!): User
  }
  type User {
    _id: ID!
    posts: [ID!]
    username: String!
    password: String
  }
`;

export default typeDefs;
