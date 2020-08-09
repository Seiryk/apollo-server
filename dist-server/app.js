"use strict";
/* eslint no-console: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const baseResolvers_1 = __importDefault(require("./entities/baseResolvers"));
const baseTypeDefs_1 = __importDefault(require("./entities/baseTypeDefs"));
const authentication_1 = require("./authentication");
const routs_config_1 = __importDefault(require("./routs-config"));
const IsAuthDirective_1 = __importDefault(require("./directives/IsAuthDirective"));
const mongoSchema_1 = __importDefault(require("./entities/user/mongoSchema"));
const isRoleDirective_1 = __importDefault(require("./directives/isRoleDirective"));
const isOwnerOrRoleDirective_1 = __importDefault(require("./directives/isOwnerOrRoleDirective"));
const { PORT, NODE_ENV, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, REDIRECT_URL, } = process.env;
(async () => {
    try {
        await mongoose_1.default.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        const app = express_1.default();
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: baseTypeDefs_1.default,
            resolvers: baseResolvers_1.default,
            playground: NODE_ENV === 'development',
            context: async ({ req, res }) => {
                const { valid, userId } = authentication_1.getTokenValidity(req);
                const userData = await mongoSchema_1.default.findById(userId);
                return {
                    req,
                    res,
                    valid,
                    user: userData,
                };
            },
            schemaDirectives: {
                isAuth: IsAuthDirective_1.default,
                isRole: isRoleDirective_1.default,
                isOwnerOrRole: isOwnerOrRoleDirective_1.default,
            },
        });
        app.use(cors_1.default({ origin: REDIRECT_URL, credentials: true }));
        app.use(body_parser_1.default.json());
        routs_config_1.default(app);
        server.applyMiddleware({ app });
        app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://*:${PORT}${server.graphqlPath}`));
    }
    catch (error) {
        console.log(`db connection unsuccessful ended with error ${error}`);
    }
})();
