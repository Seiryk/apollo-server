import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    company(position: Int): [Company!]
    companies(id: ID!): Company
  }
  extend type Mutation {
    addCompany(name: String): Company
  }
  type Company {
    id: ID!
    name: String!
    employees: [Profile]
  }
`;
