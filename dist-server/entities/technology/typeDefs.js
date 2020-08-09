"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `    
    input TechnologySearchFilters {
        name: String
    }
    extend type Query {
        technology(id: ID!): Technology
        technologies: [Technology!]!
        technologiesList(
            searchFilters: TechnologySearchFilters,
            limit: Int,
            page: Int,
        ): TechnologiesList! 
    }
    extend type Mutation {
        addTechnology(input: TechnologyInput!): Technology! @isAuth
        updateTechnology(id: ID!, input: TechnologyInput!): Technology @isAuth
        removeTechnology(id: ID!): Technology @isAuth
    }
    type Technology {
        id: ID!
        name: String!
    }
    input TechnologyInput {
        name: String!
    }
    type TechnologiesList {
        items: [Technology]!
        page: Int!
        totalPages: Int!
        totalItems: Int!
        limit: Int!
    }
`;
