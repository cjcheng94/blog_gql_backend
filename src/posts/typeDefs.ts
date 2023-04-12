import { gql } from "graphql-tag";

const typeDefs = gql`
  extend type Query {
    posts(first: Int, after: String): PostsResponse
    getPostById(_id: String!): Post
    getPostsByTags(tagIds: [ID]!): [Post]
    search(searchTerm: String!, tagIds: [ID]): [PostSearchResult]
  }
  extend type Mutation {
    createPost(
      title: String!
      content: String!
      contentText: String!
      thumbnailUrl: String
      tagIds: [ID]!
    ): Post!
    updatePost(
      _id: String!
      title: String!
      content: String!
      contentText: String!
      thumbnailUrl: String
      tagIds: [ID]!
    ): Post
    deletePost(_id: String!): Post
  }
  type Post {
    _id: ID!
    title: String!
    author: String!
    content: String!
    contentText: String!
    date: String!
    authorInfo: User!
    tags: [Tag]!
    tagIds: [ID]!
    thumbnailUrl: String
  }
  type PostEdge {
    cursor: String
    node: Post
  }
  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }
  type PostsResponse {
    edges: [PostEdge]
    pageInfo: PageInfo
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
  type PostSearchResult {
    _id: ID!
    title: String!
    author: String!
    content: String!
    contentText: String!
    date: String!
    score: Float
    authorInfo: User!
    tags: [Tag]!
    tagIds: [ID]!
    highlights: [Highlight]
    thumbnailUrl: String
  }
`;

export default typeDefs;
