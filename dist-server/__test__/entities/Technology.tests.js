"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_testing_1 = require("apollo-server-testing");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const _utils_1 = require("../test-utils/_utils");
const mongoSchema_1 = __importDefault(require("../../entities/technology/mongoSchema"));
const _mockData_1 = require("../test-utils/_mockData");
const mongoSchema_2 = __importDefault(require("../../entities/user/mongoSchema"));
const QUERY_TECHNOLOGY = apollo_server_express_1.gql `
  query ($id: ID!){
    technology(id: $id) {
      id
      name
    }
  }
`;
const QUERY_TECHNOLOGIES = apollo_server_express_1.gql `
  {
    technologies {
      id
      name
    }
  }
`;
const QUERY_TECHNOLOGIES_LIST = apollo_server_express_1.gql `
   {
    technologiesList {
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
const MUTATION_ADD_TECHNOLOGY = apollo_server_express_1.gql `
  mutation ($input: TechnologyInput!){
    addTechnology(input: $input) {
      id
      name
    }
  }
`;
const MUTATION_UPDATE_TECHNOLOGY = apollo_server_express_1.gql `
  mutation ($id: ID!, $input: TechnologyInput!){
    updateTechnology(id: $id, input: $input) {
      id
      name
    }
  }
`;
const MUTATION_REMOVE_TECHNOLOGY = apollo_server_express_1.gql `
  mutation ($id: ID!){
    removeTechnology(id: $id) {
      id
      name
    }
  }
`;
describe('Technology', () => {
    let server;
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        await _utils_1.preFillDB();
        server = await _utils_1.createTestServer({ valid: true, user: mongoSchema_2.default.hydrate(_mockData_1.mockTestData.user) });
    });
    describe('queries', () => {
        it('technology', async () => {
            const tech = await mongoSchema_1.default.findOne({});
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_TECHNOLOGY, variables: { id: tech.id } });
            const data = res.data.technology;
            expect(data.name).toEqual(tech.name);
        });
        it('technologies', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_TECHNOLOGIES });
            const data = res.data.technologies;
            expect(data).not.toHaveLength(0);
        });
        it('technologiesList', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_TECHNOLOGIES_LIST });
            const data = res.data.technologiesList;
            expect(data.totalItems).toEqual(1);
            expect(data.page).toEqual(1);
            expect(data.items).toHaveLength(data.totalItems);
        });
    });
    describe('mutations', () => {
        it('addTechnology', async () => {
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'Tech2' };
            const res = await mutate({ mutation: MUTATION_ADD_TECHNOLOGY, variables: { input } });
            const data = res.data.addTechnology;
            expect(data.name).toEqual(input.name);
        });
        it('updateTechnology', async () => {
            const tech = await mongoSchema_1.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'Tech3' };
            const res = await mutate({
                mutation: MUTATION_UPDATE_TECHNOLOGY,
                variables: { id: tech.id, input },
            });
            const data = res.data.updateTechnology;
            expect(data.name).toEqual(input.name);
        });
        it('removeTechnology', async () => {
            const tech = await mongoSchema_1.default.findOne({});
            const { query, mutate } = apollo_server_testing_1.createTestClient(server);
            const removeRes = await mutate({
                mutation: MUTATION_REMOVE_TECHNOLOGY,
                variables: { id: tech.id },
            });
            const deletedData = removeRes.data.removeTechnology;
            expect(deletedData.id).toEqual(tech.id);
            const res = await query({ query: QUERY_TECHNOLOGY, variables: { id: tech.id } });
            const data = res.data.technology;
            expect(data).toBeNull();
        });
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
