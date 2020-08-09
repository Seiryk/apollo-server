import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    profile(id: ID!): Profile
    profiles(position: Int): [Profile!]
  }

  extend type Mutation {
    addProfile(name: String): Profile
  }

  type WorkType {
    value: String!
    label: String!
  }

  type Experience {
    position: String!
    company: Company!
    workType: String!
    startDate: String!
    endDate: String
    country: String!
    city: String!
  }

  type Education {
    course: String!
    degree: String!
    startDate: String!
    endDate: String
    country: String!
    city: String!
  }

  type Profile {
    id: ID!
    name: String!
    surname: String!
    country: String!
    workType: String!
    city: String!
    email: String!
    createdAt: String!
    position: String!
    summary: String!
    company: Company!
    salaryMin: Int!
    salaryMax: Int!
    expertise: [Technology]
    education: [Education]
    experience: [Experience]
  }
`;
// feedback: [Feedback]
