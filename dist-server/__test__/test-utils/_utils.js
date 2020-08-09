"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAllTestCollections = exports.preFillDB = exports.createTestServer = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const baseTypeDefs_1 = __importDefault(require("../../entities/baseTypeDefs"));
const baseResolvers_1 = __importDefault(require("../../entities/baseResolvers"));
const IsAuthDirective_1 = __importDefault(require("../../directives/IsAuthDirective"));
const isRoleDirective_1 = __importDefault(require("../../directives/isRoleDirective"));
const isOwnerOrRoleDirective_1 = __importDefault(require("../../directives/isOwnerOrRoleDirective"));
const mongoSchema_1 = __importDefault(require("../../entities/technology/mongoSchema"));
const _mockData_1 = require("./_mockData");
const mongoSchema_2 = __importDefault(require("../../entities/role/mongoSchema"));
const mongoSchema_3 = __importDefault(require("../../entities/user/mongoSchema"));
const mongoSchema_4 = __importDefault(require("../../entities/position/mongoSchema"));
const mongoSchema_5 = __importDefault(require("../../entities/company/mongoSchema"));
const Role_types_1 = require("../../entities/role/Role.types");
const mongoSchema_6 = __importDefault(require("../../entities/profile/mongoSchema"));
const mongoSchema_7 = __importDefault(require("../../entities/companyReference/mongoSchema"));
exports.createTestServer = async (ctx) => new apollo_server_express_1.ApolloServer({
    typeDefs: baseTypeDefs_1.default,
    resolvers: baseResolvers_1.default,
    context: (req, res) => ({ ...ctx, req, res }),
    schemaDirectives: {
        isAuth: IsAuthDirective_1.default,
        isRole: isRoleDirective_1.default,
        isOwnerOrRole: isOwnerOrRoleDirective_1.default,
    },
});
exports.preFillDB = async () => {
    const roles = await mongoSchema_2.default.create(_mockData_1.mockInputTestData.role);
    const superAdminRole = roles.find((role) => role.value === Role_types_1.RoleValues.SUPER_ADMIN);
    const [positions, technologies, users] = await Promise.all([
        await mongoSchema_4.default.create(_mockData_1.mockInputTestData.position),
        await mongoSchema_1.default.create(_mockData_1.mockInputTestData.technology),
        await mongoSchema_3.default.create([{ ..._mockData_1.mockInputTestData.user[0], role: superAdminRole.id }, { ..._mockData_1.mockInputTestData.user[1] }]),
    ]);
    const companies = await mongoSchema_5.default.create([{ ..._mockData_1.mockInputTestData.company }]);
    const companyReference = await mongoSchema_7.default.create({ name: companies[0].name, company: companies[0].id });
    const profiles = await mongoSchema_6.default.create([{
            ..._mockData_1.mockInputTestData.profile[0],
            company: companies[0].id,
            experience: [{
                    company: companyReference.id,
                    endDate: new Date(),
                    startDate: date_fns_1.subMonths(new Date(), 5),
                    position: 'Bombaliera',
                    workType: 'part-time',
                }],
        }]);
    return {
        roles,
        positions,
        technologies,
        users,
        companies,
        profiles,
    };
};
exports.removeAllTestCollections = () => new Promise((resolve) => {
    const collections = Object.keys(mongoose_1.default.connection.collections);
    collections.forEach(async (key, index) => {
        const collection = mongoose_1.default.connection.collections[key];
        await collection.deleteMany({});
        if (index >= collections.length - 1)
            resolve();
    });
});
