"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `    
    extend type Query {
        role(id: ID!): Role @isRole(roles: [SUPER_ADMIN]) @isAuth 
        roles: [Role!]! @isRole(roles: [SUPER_ADMIN]) @isAuth 
    }
    type Role {
        id: ID!
        name: String!
        value: Int!
    }
    
    enum RoleValues {
        REPRESENTATIVE,
        COMPANY_ADMIN,
        SUPER_ADMIN
    }
`;
