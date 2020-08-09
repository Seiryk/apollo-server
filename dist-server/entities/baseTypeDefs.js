"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = __importDefault(require("./technology/typeDefs"));
const typeDefs_2 = __importDefault(require("./company/typeDefs"));
const typeDefs_3 = __importDefault(require("./profile/typeDefs"));
const typeDefs_4 = __importDefault(require("./position/typeDefs"));
const typeDefs_5 = __importDefault(require("./user/typeDefs"));
const typeDefs_6 = __importDefault(require("./role/typeDefs"));
const typeDefs_7 = __importDefault(require("./companyReference/typeDefs"));
const root = apollo_server_express_1.gql `
  directive @isAuth on FIELD_DEFINITION
  directive @isRole(roles: [RoleValues]) on FIELD_DEFINITION
  directive @isOwnerOrRole(ownerCheckField: String, role: RoleValues) on FIELD_DEFINITION

  scalar Date
  scalar DateTime
  
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;
exports.default = [
    root,
    typeDefs_2.default,
    typeDefs_3.default,
    typeDefs_1.default,
    typeDefs_4.default,
    typeDefs_5.default,
    typeDefs_6.default,
    typeDefs_7.default,
];
