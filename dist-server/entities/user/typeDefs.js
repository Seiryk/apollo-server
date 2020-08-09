"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `  
  extend type Query {
    user(id: ID!): User @isAuth
  }
  type User {
    id: ID!
    email: String!
    googleId: String @isOwnerOrRole(ownerCheckField: "id", role: SUPER_ADMIN)
    surname: String!
    name: String!
    company: Company
    role: Role
  }
`;
