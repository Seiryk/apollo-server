"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `  
  extend type Query {
    position(id: ID!): Position
    positions: [Position!]!
    positionsList(
      searchFilters: PositionSearchFilters,
      limit: Int,
      page: Int,
    ): PositionsList!
  }
  extend type Mutation {
    addPosition(input: PositionInput!): Position! @isAuth
    updatePosition(id: ID!, input: PositionInput!): Position @isAuth
    removePosition(id: ID!): Position @isAuth
  }
  
  input PositionSearchFilters {
    name: String
  }
  type Position {
    id: ID!
    name: String!
  }
  input PositionInput {
    name: String!
  }
  type PositionsList {
    items: [Position]!
    page: Int!
    totalPages: Int!
    totalItems: Int!
    limit: Int!
  }
`;
