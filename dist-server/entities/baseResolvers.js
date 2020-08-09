"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_iso_date_1 = require("graphql-iso-date");
const resolver_1 = __importDefault(require("./profile/resolver"));
const resolver_2 = __importDefault(require("./company/resolver"));
const resolver_3 = __importDefault(require("./technology/resolver"));
const resolver_4 = __importDefault(require("./position/resolver"));
const resolver_5 = __importDefault(require("./user/resolver"));
const resolver_6 = __importDefault(require("./role/resolver"));
const resolver_7 = __importDefault(require("./companyReference/resolver"));
const customScalarResolver = {
    Date: graphql_iso_date_1.GraphQLDate,
    DateTime: graphql_iso_date_1.GraphQLDateTime,
};
exports.default = [
    customScalarResolver,
    resolver_1.default,
    resolver_2.default,
    resolver_3.default,
    resolver_4.default,
    resolver_5.default,
    resolver_6.default,
    resolver_7.default,
];
