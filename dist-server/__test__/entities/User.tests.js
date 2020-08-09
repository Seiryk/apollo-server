"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_testing_1 = require("apollo-server-testing");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const _utils_1 = require("../test-utils/_utils");
const _mockData_1 = require("../test-utils/_mockData");
const Role_types_1 = require("../../entities/role/Role.types");
const mongoSchema_1 = __importDefault(require("../../entities/role/mongoSchema"));
const mongoSchema_2 = __importDefault(require("../../entities/user/mongoSchema"));
const QUERY_USER = apollo_server_express_1.gql `
  query ($id: ID!){
    user(id: $id) {
      id
      name
      surname
      email
      googleId
      role {
        name
      }
    }
  }
`;
describe('User', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        await _utils_1.preFillDB();
    });
    describe('queries', () => {
        it('user: works for authed user', async () => {
            const superAdminRole = await mongoSchema_1.default.findOne({ value: Role_types_1.RoleValues.SUPER_ADMIN });
            const superAdminUser = await mongoSchema_2.default.findOne({ role: superAdminRole.id });
            const otherUser = await mongoSchema_2.default.findOne({ name: _mockData_1.mockInputTestData.user[1].name });
            const server = await _utils_1.createTestServer({
                valid: true,
                user: superAdminUser,
            });
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_USER, variables: { id: otherUser.id } });
            const data = res.data.user;
            expect(data.id).toEqual(otherUser.id);
        });
        it('user: some fields are only for superadmin', async () => {
            const superAdminRole = await mongoSchema_1.default.findOne({ value: Role_types_1.RoleValues.SUPER_ADMIN });
            const superAdminUser = await mongoSchema_2.default.findOne({ role: superAdminRole.id });
            const otherUser = await mongoSchema_2.default.findOne({ name: _mockData_1.mockInputTestData.user[1].name });
            const server = await _utils_1.createTestServer({
                valid: true,
                user: superAdminUser,
            });
            const { query } = apollo_server_testing_1.createTestClient(server);
            let res = await query({ query: QUERY_USER, variables: { id: otherUser.id } });
            let data = res.data.user;
            expect(data.googleId).toEqual(otherUser.googleId);
            const notSuperServer = await _utils_1.createTestServer({
                valid: true,
                user: mongoSchema_2.default.hydrate(_mockData_1.mockInputTestData.user[1]),
            });
            const { query: notSuperQuery } = apollo_server_testing_1.createTestClient(notSuperServer);
            res = await notSuperQuery({ query: QUERY_USER, variables: { id: otherUser.id } });
            data = res.data.user;
            expect(data.googleId).toBeNull();
        });
        it('user: does not work for unauthed user', async () => {
            const user = await mongoSchema_2.default.findOne({});
            const server = await _utils_1.createTestServer({
                valid: true,
                user: null,
            });
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_USER, variables: { id: user.id } });
            expect(res.errors).not.toHaveLength(0);
        });
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
