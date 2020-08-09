"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_testing_1 = require("apollo-server-testing");
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const _utils_1 = require("../test-utils/_utils");
const Role_types_1 = require("../../entities/role/Role.types");
const mongoSchema_1 = __importDefault(require("../../entities/profile/mongoSchema"));
const _mockData_1 = require("../test-utils/_mockData");
const mongoSchema_2 = __importDefault(require("../../entities/user/mongoSchema"));
const QUERY_PROFILE = apollo_server_express_1.gql `
  query ($id: ID!){
    profile(id: $id) {
      id
      name
      surname
      workType
      city
      country
      email
      position {
        id
        name
      }
      summary
      company {
        id
        name
      }
      salaryMin
      salaryMax
      status
      expertise {
        id
        name
      }
      education {
        city
        course
        startDate
      }
      experience {
        startDate
        endDate
        months
        company {
          id
          name
        }
      }
      totalMonths
    }
  }
`;
const QUERY_PROFILES = apollo_server_express_1.gql `
  query ($searchFilters: ProfilesSearchFilters){
    profiles(searchFilters: $searchFilters) {
      items {
        id
        name
        surname
        workType
        city
        country
        email
        position {
          id
          name
        }
        summary
        company {
          id
          name
        }
        salaryMin
        salaryMax
        status
        expertise {
          id
          name
        }
        education {
          city
          course
          startDate
        }
        experience {
          startDate
          months
          company {
            id
            name
          }
        }
        totalMonths
      }
      limit
      totalItems
      totalPages
      page
    }}
`;
const MUTATION_ADD_PROFILE = apollo_server_express_1.gql `
  mutation ($input: ProfileInput!){
    addProfile(input: $input) {
      id
      name
      position {
        name
      }
      company {
        id
      }
      expertise {
        name
      }
      experience {
        months
      }
      totalMonths
      status
    }
  }
`;
const MUTATION_UPDATE_PROFILE = apollo_server_express_1.gql `
  mutation ($id: ID!, $input: ProfileUpdateInput!){
    updateProfile(id: $id, input: $input) {
      id
      name
    }
  }
`;
const MUTATION_REMOVE_PROFILE = apollo_server_express_1.gql `
  mutation removeCompany($id: ID!){
    removeProfile(id: $id) {
      id
      name
    }
  }
`;
describe('Profile', () => {
    let server;
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        const { roles, companies, users } = await _utils_1.preFillDB();
        const superAdminRole = roles.find((item) => item.value === Role_types_1.RoleValues.SUPER_ADMIN);
        const superUser = users.find((item) => item.role.toHexString() === superAdminRole.id);
        superUser.company = companies[0].id;
        server = await _utils_1.createTestServer({ valid: true, user: superUser });
    });
    describe('queries', () => {
        it('profile', async () => {
            const profile = await mongoSchema_1.default.findOne({});
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_PROFILE, variables: { id: profile.id } });
            const data = res.data.profile;
            expect(data.name).toEqual(profile.name);
            expect(data.totalMonths).toBeTruthy();
            expect(data.experience[0].months).toBeTruthy();
        });
        it('profiles', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const res = await query({ query: QUERY_PROFILES });
            const data = res.data.profiles;
            expect(data.totalItems).toEqual(1);
            expect(data.page).toEqual(1);
            expect(data.items).toHaveLength(data.totalItems);
        });
        it('profiles: fuzzy search works', async () => {
            const { query } = apollo_server_testing_1.createTestClient(server);
            const searchFilters = { city: _mockData_1.mockInputTestData.profile[0].city.replace(_mockData_1.mockInputTestData.profile[0].city.substring(0, 1), 'x') };
            const res = await query({ query: QUERY_PROFILES, variables: { searchFilters } });
            const data = res.data.profiles;
            expect(data.totalItems).toEqual(1);
            expect(data.page).toEqual(1);
            expect(data.items).toHaveLength(data.totalItems);
        });
    });
    describe('mutations', () => {
        it('addProfile', async () => {
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = {
                name: 'Ivan',
                surname: 'Bolvan',
                email: 'compo4@test.com',
                workType: 'part-time',
                positionNew: { name: 'The Hero' },
                expertiseNew: [{ name: 'Heroing' }],
                experience: [{
                        position: 'StarMiller',
                        workType: 'part-time',
                        startDate: date_fns_1.formatISO(date_fns_1.subMonths(new Date(), 12)),
                        endDate: date_fns_1.formatISO(new Date()),
                        companyNew: {
                            name: 'Schmompany',
                        },
                    }],
                education: [{
                        course: 'Heroigly',
                        degree: 'Master Hero',
                        startDate: date_fns_1.formatISO(date_fns_1.subMonths(new Date(), 24)),
                        city: 'Macity',
                        country: 'Macountry',
                    }],
            };
            const res = await mutate({ mutation: MUTATION_ADD_PROFILE, variables: { input } });
            const data = res.data.addProfile;
            expect(data.name).toEqual(input.name);
            expect(data.status).toEqual('active');
            expect(data.experience[0].months).toEqual(12);
            expect(data.totalMonths).toEqual(12);
            const { position, company, expertise } = res.data.addProfile;
            expect(position.name).toEqual(input.positionNew.name);
            expect(company.id).toBeTruthy();
            expect(expertise[0].name).toEqual(input.expertiseNew[0].name);
        });
        it('updateProfile', async () => {
            const profile = await mongoSchema_1.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const input = { name: 'Bohdan' };
            const res = await mutate({
                mutation: MUTATION_UPDATE_PROFILE,
                variables: { id: profile.id, input },
            });
            const data = res.data.updateProfile;
            expect(data.name).toEqual(input.name);
        });
        it('updateProfile: doesnt work for users with a different company', async () => {
            const otherCompanyUser = { ..._mockData_1.mockTestData.user, company: Math.random() };
            const otherCompanyServer = await _utils_1.createTestServer({ valid: true, user: mongoSchema_2.default.hydrate(otherCompanyUser) });
            const profile = await mongoSchema_1.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(otherCompanyServer);
            const input = { name: 'Bohdan' };
            const res = await mutate({
                mutation: MUTATION_UPDATE_PROFILE,
                variables: { id: profile.id, input },
            });
            expect(res.errors).not.toHaveLength(0);
        });
        it('removeProfile', async () => {
            const profile = await mongoSchema_1.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(server);
            const removeRes = await mutate({
                mutation: MUTATION_REMOVE_PROFILE,
                variables: { id: profile.id },
            });
            const deletedData = removeRes.data.removeProfile;
            expect(deletedData.id).toEqual(profile.id);
        });
        it('removeProfile: doesnt work for users with a different company', async () => {
            const otherCompanyUser = { ..._mockData_1.mockTestData.user, company: Math.random() };
            const otherCompanyServer = await _utils_1.createTestServer({ valid: true, user: mongoSchema_2.default.hydrate(otherCompanyUser) });
            const profile = await mongoSchema_1.default.findOne({});
            const { mutate } = apollo_server_testing_1.createTestClient(otherCompanyServer);
            const removeRes = await mutate({
                mutation: MUTATION_REMOVE_PROFILE,
                variables: { id: profile.id },
            });
            expect(removeRes.errors).not.toHaveLength(0);
        });
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
