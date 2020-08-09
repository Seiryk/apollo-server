"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `  
  input CompaniesSearchFilters {
    name: String
  }
  extend type Query {
    company(id: ID!): Company
    companies: [Company!]!
    companiesList(
      searchFilters: CompaniesSearchFilters,
      limit: Int,
      page: Int,
    ): CompaniesList!
  }
  extend type Mutation {
    addCompany(input: CompanyInput!): Company! @isAuth
    updateCompany(id: ID!, input: CompanyUpdateInput!): Company! @isRole(roles: [COMPANY_ADMIN, SUPER_ADMIN]) @isOwnerOrRole(role: SUPER_ADMIN)
    updateCompanyStatus(id: ID!, status: CompanyStatuses): Company! @isRole(roles: [SUPER_ADMIN])
    removeCompany(id: ID!): Company! @isRole(roles: [SUPER_ADMIN])
  }
  
  type Location {
    city: String!
    country: String!
  }
  input LocationInput {
    city: String!
    country: String!
  }
  
  enum CompanyStatuses {
    UNVERIFIED
    ACTIVE
  }
  
  type Company {
    id: ID!
    name: String!
    slogan: String
    description: String
    employeesCount: Int
    email: String!
    websiteLink: String
    locations: [Location]
    representatives: [User!]
    images: [String]
    status: Int
  }
  input CompanyInput {
    name: String!
    slogan: String
    description: String
    employeesCount: Int
    email: String!
    websiteLink: String
    locations: [LocationInput]
    images: [String]
  }
  
  input CompanyUpdateInput {
    name: String
    slogan: String
    description: String
    employeesCount: Int
    email: String
    websiteLink: String
    representatives: [String]
    locations: [LocationInput]
    images: [String]
  }
  
  type CompaniesList {
    items: [Company]!
    page: Int!
    totalPages: Int!
    totalItems: Int!
    limit: Int!
  }
`;
