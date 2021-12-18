import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    posts: [Post]
    getPostById(_id: String!): Post
    getPostsByTags(tagIds: [ID]!): [Post]
    search(searchTerm: String!, tagIds: [ID]): [PostResult]
  }
  extend type Mutation {
    createPost(
      title: String!
      content: String!
      contentText: String!
      tagIds: [ID]!
    ): Post!
    updatePost(
      _id: String!
      title: String!
      content: String!
      contentText: String!
      tagIds: [ID]!
    ): Post
    deletePost(_id: String!): Post
  }
  type Post {
    _id: ID!
    title: String!
    author: String!
    content: String!
    date: String!
    authorInfo: User!
    tags: [Tag]!
    tagIds: [ID]!
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
    tags: [Tag]!
    tagIds: [ID]!
    highlights: [Highlight]
  }
`;

export default typeDefs;
