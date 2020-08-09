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
const mongoSchema_2 = __importDefault(require("../../entities/companyReference/mongoSchema"));
const mongoSchema_3 = __importDefault(require("../../entities/company/mongoSchema"));
const QUERY_COMPANY_REFERENCE = apollo_server_express_1.gql `
  query ($id: ID!){
    companyReference(id: $id) {
      id
      name
      company {
        id
        name
      }
    }
  }
`;
const QUERY_COMPANY_REFERENCES = apollo_server_express_1.gql `
  {
    companyReferences {
      id
      name
      company {
        id
        name
      }
    }
  }
`;
const QUERY_COMPANY_REFERENCES_LIST = apollo_server_express_1.gql `
   {
    companyReferencesList {
      items {
        id
        name
        company {
          id
          name
        }
      }
      totalItems
      limit
      totalPages
      page
    }
  }
`;
const MUTATION_ADD_COMPANY_REFERENCE = apollo_server_express_1.gql `
  mutation ($input: CompanyReferenceInput!){
    addCompanyReference(input: $input) {
      id
      name
      company {
        id
        name
      }
    }
  }
`;
const MUTATION_UPDATE_COMPANY_REFERENCE = apollo_server_express_1.gql `
  mutation ($id: ID!, $input: CompanyReferenceInput!){
    updateCompanyReference(id: $id, input: $input) {
      id
      name
      company {
        id
        name
      }
    }
  }
`;
const MUTATION_REMOVE_COMPANY_REFERENCE = apollo_server_express_1.gql `
  mutation ($id: ID!){
    removeCompanyReference(id: $id) {
      id
      name
      company {
        id
        name
      }
    }
  }
`;
describe('CompanyReference', () => {
    let server;
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        await _utils_1.preFillDB();
        server = await _utils_1.createTestServer({ valid: true, user: mongoSchema_1.default.hydrate(_mockData_1.mockTestData.user) });
    });
    describe('queries', () => {
        it('companyReference', async () => {
            const compoRef = await mongoSchema_2.default.findOne({});
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_COMPANY_REFERENCE, variables: { id: compoRef.id } });
            const data = res.data.companyReference;
            expect(data.name).toEqual(compoRef.name);
        });
        it('companyReferences', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_COMPANY_REFERENCES });
            const data = res.data.companyReferences;
            expect(data).not.toHaveLength(0);
        });
        it('companyReferencesList', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_COMPANY_REFERENCES_LIST });
            const data = res.data.companyReferencesList;
            expect(data.totalItems).toEqual(1);
            expect(data.page).toEqual(1);
            expect(data.items).toHaveLength(data.totalItems);
        });
    });
    describe('mutations', () => {
        it('addCompanyReference', async () => {
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'Ref2' };
            const res = await mutate({ mutation: MUTATION_ADD_COMPANY_REFERENCE, variables: { input } });
            const data = res.data.addCompanyReference;
            expect(data.name).toEqual(input.name);
        });
        it('updateCompanyReference', async () => {
            const compoRef = await mongoSchema_2.default.findOne({});
            const existingCompany = await mongoSchema_3.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'Ref3', company: existingCompany.id };
            const res = await mutate({
                mutation: MUTATION_UPDATE_COMPANY_REFERENCE,
                variables: { id: compoRef.id, input },
            });
            const data = res.data.updateCompanyReference;
            expect(data.name).toEqual(input.name);
            const { company } = res.data.updateCompanyReference;
            expect(company.id).toEqual(existingCompany.id);
        });
        it('removeCompanyReference', async () => {
            const compoRef = await mongoSchema_2.default.findOne({});
            const { query, mutate } = apollo_server_testing_1.createTestClient(server);
            const removeRes = await mutate({
                mutation: MUTATION_REMOVE_COMPANY_REFERENCE,
                variables: { id: compoRef.id },
            });
            const deletedData = removeRes.data.removeCompanyReference;
            expect(deletedData.id).toEqual(compoRef.id);
            const res = await query({ query: QUERY_COMPANY_REFERENCE, variables: { id: compoRef.id } });
            const data = res.data.companyReference;
            expect(data).toBeNull();
        });
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
