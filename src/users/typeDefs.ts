import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    users: [User]
    userSignup(username: String!, password: String!): User
    userLogin(username: String!, password: String!): String
    getUserPosts(username: String!): [Post]
  }
  type User {
    _id: ID!
    posts: [ID]
    username: String!
    password: String!
  }
`;

export default typeDefs;
