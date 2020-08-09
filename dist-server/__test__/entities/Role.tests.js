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
const mongoSchema_1 = __importDefault(require("../../entities/user/mongoSchema"));
const Role_types_1 = require("../../entities/role/Role.types");
const mongoSchema_2 = __importDefault(require("../../entities/role/mongoSchema"));
const QUERY_ROLE = apollo_server_express_1.gql `
  query ($id: ID!){
    role(id: $id) {
      id
      name
      value
    }
  }
`;
const QUERY_ROLES = apollo_server_express_1.gql `
  {
    roles {
      id
      name
      value
    }
  }
`;
describe('Role', () => {
    let server;
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        await _utils_1.preFillDB();
        const superAdminRole = await mongoSchema_2.default.findOne({ value: Role_types_1.RoleValues.SUPER_ADMIN });
        server = await _utils_1.createTestServer({
            valid: true,
            user: mongoSchema_1.default.hydrate({
                ..._mockData_1.mockTestData.user, role: superAdminRole.id,
            }),
        });
    });
    describe('queries', () => {
        it('role', async () => {
            const role = await mongoSchema_2.default.findOne({});
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_ROLE, variables: { id: role.id } });
            const data = res.data.role;
            expect(data.name).toEqual(role.name);
        });
        it('roles', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_ROLES });
            const data = res.data.roles;
            expect(data).not.toHaveLength(0);
        });
        it('work only for super admin', async () => {
            const role = await mongoSchema_2.default.findOne({});
            const notSuperServer = await _utils_1.createTestServer({
                valid: true, user: mongoSchema_1.default.hydrate({ ..._mockData_1.mockTestData.user }),
            });
            const { query } = apollo_server_testing_1.createTestClient(notSuperServer);
            const roleRes = await query({ query: QUERY_ROLE, variables: { id: role.id } });
            expect(roleRes.errors).not.toHaveLength(0);
            const rolesRes = await query({ query: QUERY_ROLES });
            expect(rolesRes.errors).not.toHaveLength(0);
        });
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
