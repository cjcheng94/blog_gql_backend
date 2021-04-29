import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    posts: [Post]
    getPostById(_id: String!): Post

    "Protected Actions"
    createPost(title: String!, content: String!): Post!
    updatePost(_id: String!, title: String, content: String): Post
    deletePost(_id: String!): Post
  }
  type Post {
    _id: ID!
    title: String!
    author: String!
    content: String!
    date: String!
  }
`;

export default typeDefs;
