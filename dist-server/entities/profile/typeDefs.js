"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
// TODO: improve restricitons on mutations
exports.default = apollo_server_express_1.gql `  
  extend type Query {
    profile(id: ID!): Profile
    profiles(searchFilters: ProfilesSearchFilters, page: Int, limit: Int): ProfilesList!
  }
  extend type Mutation {
    addProfile(input: ProfileInput!): Profile! @isAuth
    updateProfile(id: ID!, input: ProfileUpdateInput!): Profile @isAuth
    removeProfile(id: ID!): Profile @isAuth
  }

  input ExperienceInput {
    workType: String!
    position: String!
    startDate: DateTime!
    endDate: DateTime!
    city: String
    country: String
    company: ID
    companyNew: CompanyReferenceInput,
  }

  input EducationInput {
    course: String!
    degree: String!
    startDate: DateTime!
    endDate: DateTime
    city: String!
    country: String!
  }

  input ProfilesSearchFilters {
    status: String
    name: String
    company: [ID]
    expertise: [ID]
    city: String
    country: String
    position: [ID]
  }

  type WorkType {
    value: String!
    label: String!
  }

  type Experience {
    id: String!
    position: String!
    company: CompanyReference!
    workType: String!
    startDate: DateTime!
    endDate: DateTime!
    city: String
    country: String
    months: Int!
  }

  type Education {
    id: String!
    course: String!
    degree: String!
    startDate: DateTime!
    endDate: DateTime
    city: String!
    country: String!
  }

  type Profile {
    id: ID!
    name: String!
    surname: String!
    workType: String!
    city: String
    country: String
    email: String!
    position: Position
    summary: String
    company: Company
    salaryMin: Int
    salaryMax: Int
    status: String!
    expertise: [Technology!]!
    education: [Education]
    experience: [Experience]
    totalMonths: Int!
  }

  type ProfilesList {
    items: [Profile]!
    page: Int!
    totalPages: Int!
    totalItems: Int!
    limit: Int!
  }

  input ProfileInput {
    name: String!
    surname: String!
    workType: String!
    email: String!
    expertise: [ID!]
    expertiseNew: [TechnologyInput!]
    summary: String
    salaryMin: Int
    salaryMax: Int
    city: String
    country: String
    position: ID
    positionNew: PositionInput
    education: [EducationInput!]
    experience: [ExperienceInput!]
  }
  
  input ProfileUpdateInput {
    name: String
    surname: String
    workType: String
    city: String
    country: String
    email: String
    position: ID
    positionNew: PositionInput
    summary: String
    salaryMin: Int
    salaryMax: Int
    expertise: [ID!]
    expertiseNew: [TechnologyInput!]
    education: [EducationInput!]
    experience: [ExperienceInput!]
  }
`;
