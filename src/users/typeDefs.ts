import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Token
  extend type Query {
    users: [User]
    user(username: String): User
    userSignup(username: String!, password: String!): User
    userLogin(username: String!, password: String!): LoginResponse
    getUserPosts(_id: String!): [Post]
  }
  type User {
    _id: ID!
    username: String!
  }
  type LoginResponse {
    userId: ID
    username: String
    token: Token
  }
`;

export default typeDefs;
