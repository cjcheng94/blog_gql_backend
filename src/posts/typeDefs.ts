import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    posts: [Post]
    getPostById(_id: String!): Post
    search(searchTerm: String): [PostResult]
  }
  extend type Mutation {
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
    authorInfo: User!
  }
  type Text {
    value: String
    type: String
  }
  type Highlight {
    path: String
    texts: [Text]
    score: Float
  }
  type PostResult {
    _id: ID!
    title: String!
    author: String!
    content: String!
    date: String!
    score: Float
    authorInfo: User!
    highlights: [Highlight]
  }
`;

export default typeDefs;
