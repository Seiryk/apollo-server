"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `    
    input CompanyReferenceSearchFilters {
        name: String
    }
    extend type Query {
        companyReference(id: ID!): CompanyReference
        companyReferences: [CompanyReference!]!
        companyReferencesList(
            searchFilters: CompanyReferenceSearchFilters,
            limit: Int,
            page: Int,
        ): CompanyReferencesList!
    }
    extend type Mutation {
        addCompanyReference(input: CompanyReferenceInput!): CompanyReference! @isAuth
        updateCompanyReference(id: ID!, input: CompanyReferenceInput!): CompanyReference @isAuth
        removeCompanyReference(id: ID!): CompanyReference @isAuth
    }
    type CompanyReference {
        id: ID!
        name: String!
        company: Company
    }
    input CompanyReferenceInput {
        name: String!
        company: String
    }
    type CompanyReferencesList {
        items: [CompanyReference]!
        page: Int!
        totalPages: Int!
        totalItems: Int!
        limit: Int!
    }
`;
