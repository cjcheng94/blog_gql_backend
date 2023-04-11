import { gql } from "graphql-tag";

const typeDefs = gql`
  extend type Query {
    getDraftById(_id: String!): Draft
    getDraftByPostId(postId: ID!): Draft
    getUserDrafts: [Draft]
  }
  extend type Mutation {
    createDraft(
      postId: ID
      title: String!
      content: String!
      contentText: String!
      thumbnailUrl: String
      tagIds: [ID]!
    ): Draft
    updateDraft(
      _id: String!
      postId: ID
      title: String!
      content: String!
      contentText: String!
      thumbnailUrl: String
      tagIds: [ID]!
    ): Draft
    deleteDraft(_id: String!): Draft
  }
  type Draft {
    _id: ID!
    postId: ID
    title: String!
    author: String!
    content: String!
    contentText: String!
    thumbnailUrl: String
    date: String!
    tags: [Tag]!
    tagIds: [ID]!
  }
`;

export default typeDefs;
