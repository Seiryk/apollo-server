"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const constants_1 = require("../constants");
class IsAuthDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        if (process.env.NODE_ENV === constants_1.DEV_ENV)
            return;
        // eslint-disable-next-line no-param-reassign
        field.resolve = async (...args) => {
            const context = args[2];
            if (!context.user || !context.valid)
                throw new apollo_server_express_1.AuthenticationError('User not authenticated');
            return resolve.apply(this, args);
        };
    }
}
exports.default = IsAuthDirective;
