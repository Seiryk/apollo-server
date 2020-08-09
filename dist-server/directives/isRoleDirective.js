"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_1 = require("graphql");
const mongoSchema_1 = __importDefault(require("../entities/role/mongoSchema"));
const Role_types_1 = require("../entities/role/Role.types");
const constants_1 = require("../constants");
class IsRoleDirective extends apollo_server_express_1.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        if (process.env.NODE_ENV === constants_1.DEV_ENV)
            return;
        // eslint-disable-next-line no-param-reassign
        field.resolve = async (...args) => {
            const { user } = args[2];
            if (!user || !user.role) {
                throw new apollo_server_express_1.AuthenticationError('The user doesn\'t have permissions for this');
            }
            const userRole = await mongoSchema_1.default.findById(user.role);
            const rolesToCompare = this.args.roles.map((role) => parseInt(Role_types_1.RoleValues[role], 10));
            if (!userRole || !rolesToCompare.includes(userRole.value)) {
                throw new apollo_server_express_1.AuthenticationError('The user doesn\'t have permissions for this');
            }
            return resolve.apply(this, args);
        };
    }
}
exports.default = IsRoleDirective;
