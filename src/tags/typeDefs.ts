import { gql } from "graphql-tag";

const typeDefs = gql`
  extend type Query {
    tags: [Tag]
    tag(_id: ID!): Tag
  }
  extend type Mutation {
    createTag(name: String!): Tag
    deleteTag(tagId: ID!): Tag
  }
  type Tag {
    _id: ID!
    name: String!
  }
`;

export default typeDefs;
