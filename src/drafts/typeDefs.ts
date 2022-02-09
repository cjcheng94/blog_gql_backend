import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    getDraftById(_id: String!): Draft
    getUserDrafts: [Draft]
  }
  extend type Mutation {
    createDraft(
      title: String!
      content: String!
      contentText: String!
      tagIds: [ID]!
    ): Draft
    updateDraft(
      _id: String!
      title: String!
      content: String!
      contentText: String!
      tagIds: [ID]!
    ): Draft
    deleteDraft(_id: String!): Draft
  }
  type Draft {
    _id: ID!
    title: String!
    author: String!
    content: String!
    date: String!
    tags: [Tag]!
    tagIds: [ID]!
  }
`;

export default typeDefs;
