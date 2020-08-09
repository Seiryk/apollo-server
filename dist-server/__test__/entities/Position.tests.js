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
const mongoSchema_2 = __importDefault(require("../../entities/position/mongoSchema"));
const QUERY_POSITION = apollo_server_express_1.gql `
  query ($id: ID!){
    position(id: $id) {
      id
      name
    }
  }
`;
const QUERY_POSITIONS = apollo_server_express_1.gql `
  {
    positions {
      id
      name
    }
  }
`;
const QUERY_POSITIONS_LIST = apollo_server_express_1.gql `
   {
    positionsList {
      items {
        id
        name
      }
      totalItems
      limit
      totalPages
      page
    }
  }
`;
const MUTATION_ADD_POSITION = apollo_server_express_1.gql `
  mutation ($input: PositionInput!){
    addPosition(input: $input) {
      id
      name
    }
  }
`;
const MUTATION_UPDATE_POSITION = apollo_server_express_1.gql `
  mutation ($id: ID!, $input: PositionInput!){
    updatePosition(id: $id, input: $input) {
      id
      name
    }
  }
`;
const MUTATION_REMOVE_POSITION = apollo_server_express_1.gql `
  mutation ($id: ID!){
    removePosition(id: $id) {
      id
      name
    }
  }
`;
describe('Position', () => {
    let server;
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        await _utils_1.preFillDB();
        server = await _utils_1.createTestServer({ valid: true, user: mongoSchema_1.default.hydrate(_mockData_1.mockTestData.user) });
    });
    describe('queries', () => {
        it('position', async () => {
            const position = await mongoSchema_2.default.findOne({});
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_POSITION, variables: { id: position.id } });
            const data = res.data.position;
            expect(data.name).toEqual(position.name);
        });
        it('positions', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_POSITIONS });
            const data = res.data.positions;
            expect(data).not.toHaveLength(0);
        });
        it('positionsList', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_POSITIONS_LIST });
            const data = res.data.positionsList;
            expect(data.totalItems).toEqual(1);
            expect(data.page).toEqual(1);
            expect(data.items).toHaveLength(data.totalItems);
        });
    });
    describe('mutations', () => {
        it('addPosition', async () => {
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'pos2' };
            const res = await mutate({ mutation: MUTATION_ADD_POSITION, variables: { input } });
            const data = res.data.addPosition;
            expect(data.name).toEqual(input.name);
        });
        it('updatePosition', async () => {
            const position = await mongoSchema_2.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'pos3' };
            const res = await mutate({
                mutation: MUTATION_UPDATE_POSITION,
                variables: { id: position.id, input },
            });
            const data = res.data.updatePosition;
            expect(data.name).toEqual(input.name);
        });
        it('removePosition', async () => {
            const position = await mongoSchema_2.default.findOne({});
            const { query, mutate } = apollo_server_testing_1.createTestClient(server);
            const removeRes = await mutate({
                mutation: MUTATION_REMOVE_POSITION,
                variables: { id: position.id },
            });
            const deletedData = removeRes.data.removePosition;
            expect(deletedData.id).toEqual(position.id);
            const res = await query({ query: QUERY_POSITION, variables: { id: position.id } });
            const data = res.data.position;
            expect(data).toBeNull();
        });
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
