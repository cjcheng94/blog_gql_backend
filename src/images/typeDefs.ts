import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    image(_id: ID!): Image
  }
  extend type Mutation {
    createImage(_id: ID!, caption: String!): Image
    updateImage(_id: ID!, caption: String!): Image
    deleteImage(_id: ID!): Image
  }
  type Image {
    _id: ID!
    caption: String!
  }
`;

export default typeDefs;
