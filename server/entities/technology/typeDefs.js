import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    technologies(position: Int): [Technology!]
    technology(id: ID!): Technology
  }
  extend type Mutation {
    addTechnology(name: String): Technology
  }
  type Technology {
    id: ID!
    name: String!
  }
`;
