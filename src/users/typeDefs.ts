import { gql } from "apollo-server";

const typeDefs = gql`
  scalar Token
  extend type Query {
    users: [User]
    user(username: String): User
    userSignup(username: String!, password: String!): User
    userLogin(username: String!, password: String!): Token
    getUserPosts(username: String!): [Post]
  }
  type User {
    _id: ID!
    posts: [Post]!
    username: String!
    password: String!
  }
`;

export default typeDefs;
