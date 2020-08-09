"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_testing_1 = require("apollo-server-testing");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const _utils_1 = require("../test-utils/_utils");
const mongoSchema_1 = __importDefault(require("../../entities/user/mongoSchema"));
const mongoSchema_2 = __importDefault(require("../../entities/company/mongoSchema"));
const Company_types_1 = require("../../entities/company/Company.types");
const mongoSchema_3 = __importDefault(require("../../entities/role/mongoSchema"));
const Role_types_1 = require("../../entities/role/Role.types");
const mongoSchema_4 = __importDefault(require("../../entities/companyReference/mongoSchema"));
const companyVerification_1 = __importDefault(require("../../services/companyVerification"));
jest.mock('../../services/companyVerification');
const QUERY_COMPANY = apollo_server_express_1.gql `
  query ($id: ID!){
    company(id: $id) {
      id
      name
      slogan
      description
      employeesCount
      email
      websiteLink
      locations {
        city
        country
      }
      representatives {
        id
        name
      }
      images
      status
    }
  }
`;
const QUERY_COMPANIES = apollo_server_express_1.gql `
  {
    companies {
      id
      name
      slogan
      description
      employeesCount
      email
      websiteLink
      locations {
        city
        country
      }
      representatives {
        id
        name
        role {
          id
          value
        }
      }
      images
      status
    }
  }
`;
const QUERY_COMPANIES_LIST = apollo_server_express_1.gql `
   {
    companiesList {
      items {
        id
        name
        slogan
        description
        employeesCount
        email
        websiteLink
        locations {
          city
          country
        }
        representatives {
          id
          name
        }
        images
        status
      }
      totalItems
      limit
      totalPages
      page
    }
  }
`;
const MUTATION_ADD_COMPANY = apollo_server_express_1.gql `
  mutation ($input: CompanyInput!){
    addCompany(input: $input) {
      id
      name
      slogan
      description
      employeesCount
      email
      websiteLink
      locations {
        city
        country
      }
      representatives {
        id
        name
        role {
          id
          value
        }
      }
      images
      status
    }
  }
`;
const MUTATION_UPDATE_COMPANY = apollo_server_express_1.gql `
  mutation ($id: ID!, $input: CompanyUpdateInput!){
    updateCompany(id: $id, input: $input) {
      id
      name
    }
  }
`;
const MUTATION_UPDATE_COMPANY_STATUS = apollo_server_express_1.gql `
  mutation ($id: ID!, $status: CompanyStatuses!){
    updateCompanyStatus(id: $id, status: $status) {
      id
      name
      status
    }
  }
`;
const MUTATION_REMOVE_COMPANY = apollo_server_express_1.gql `
  mutation removeCompany($id: ID!){
    removeCompany(id: $id) {
      id
      name
    }
  }
`;
describe('Company', () => {
    let server;
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        const { roles, users } = await _utils_1.preFillDB();
        const superAdminRole = roles.find((item) => item.value === Role_types_1.RoleValues.SUPER_ADMIN);
        const superUser = users.find((item) => item.role.toHexString() === superAdminRole.id);
        server = await _utils_1.createTestServer({ valid: true, user: superUser });
    });
    describe('queries', () => {
        it('company', async () => {
            const company = await mongoSchema_2.default.findOne({});
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_COMPANY, variables: { id: company.id } });
            const data = res.data.company;
            expect(data.name).toEqual(company.name);
        });
        it('companies', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_COMPANIES });
            const data = res.data.companies;
            expect(data).not.toHaveLength(0);
        });
        it('companiesList', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_COMPANIES_LIST });
            const data = res.data.companiesList;
            expect(data.totalItems).toEqual(1);
            expect(data.page).toEqual(1);
            expect(data.items).toHaveLength(data.totalItems);
        });
    });
    describe('mutations', () => {
        it('addCompany', async () => {
            // create a server with a representative user
            const defaultRole = await mongoSchema_3.default.findOne({ value: Role_types_1.RoleValues.REPRESENTATIVE });
            const representativeUser = await mongoSchema_1.default.findOne({ role: defaultRole.id });
            const representativeServer = await _utils_1.createTestServer({ valid: true, user: representativeUser });
            const { mutate } = apollo_server_testing_1.createTestClient(representativeServer);
            const input = { name: 'Compo4', email: 'compo4@test.com', locations: [{ city: 'Belugi', country: 'Fulugi' }] };
            const res = await mutate({ mutation: MUTATION_ADD_COMPANY, variables: { input } });
            const data = res.data.addCompany;
            expect(data.name).toEqual(input.name);
            const representative = res.data.addCompany.representatives[0];
            const userRole = res.data.addCompany.representatives[0].role;
            expect(representative.name).toEqual(representativeUser.name);
            expect(userRole.value).toEqual(Role_types_1.RoleValues.COMPANY_ADMIN);
            expect(companyVerification_1.default.createRequest).toHaveBeenCalledTimes(1);
        });
        it('updateCompany', async () => {
            const company = await mongoSchema_2.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'UpdatedCompo' };
            const res = await mutate({
                mutation: MUTATION_UPDATE_COMPANY,
                variables: { id: company.id, input },
            });
            const data = res.data.updateCompany;
            expect(data.name).toEqual(input.name);
        });
        it('updateCompanyStatus', async () => {
            const company = await mongoSchema_2.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const status = 'ACTIVE';
            const res = await mutate({
                mutation: MUTATION_UPDATE_COMPANY_STATUS,
                variables: { id: company.id, status },
            });
            const data = res.data.updateCompanyStatus;
            expect(data.status).toEqual(Company_types_1.CompanyStatuses[status]);
        });
        it('removeCompany', async () => {
            const company = await mongoSchema_2.default.findOne({});
            const { query, mutate } = apollo_server_testing_1.createTestClient(server);
            const removeRes = await mutate({
                mutation: MUTATION_REMOVE_COMPANY,
                variables: { id: company.id },
            });
            const deletedData = removeRes.data.removeCompany;
            expect(deletedData.id).toEqual(company.id);
            const res = await query({ query: QUERY_COMPANY, variables: { id: company.id } });
            const companyData = res.data.company;
            expect(companyData).toBeNull();
            const referenceRes = await mongoSchema_4.default.findOne({ company: company.id });
            expect(referenceRes).toBeNull();
            const usersRes = await mongoSchema_1.default.find({ company: company.id });
            expect(usersRes).toHaveLength(0);
        });
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
