import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    user(id: ID!): User
  }
  type User {
    id: ID!
    email: String!
    googleId: String!
    surname:: String!
    name:: String!
  }
`;
