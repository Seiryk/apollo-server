"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const date_fns_1 = require("date-fns");
const index_1 = __importStar(require("../index"));
const authentication_1 = require("../../authentication");
const mongoSchema_1 = __importDefault(require("../../entities/companyReference/mongoSchema"));
const mongoSchema_2 = __importDefault(require("../../entities/company/mongoSchema"));
const mongoSchema_3 = __importDefault(require("../../entities/user/mongoSchema"));
const mongoSchema_4 = __importDefault(require("../../entities/role/mongoSchema"));
const mongoSchema_5 = __importDefault(require("../../entities/companyVerification/mongoSchema"));
const companyVerification_1 = __importDefault(require("../../services/companyVerification"));
const Role_types_1 = require("../../entities/role/Role.types");
const utils_1 = require("./utils");
const defaultGetFilter = 'status eq 1';
exports.default = {
    get: index_1.Get(mongoSchema_2.default, { filter: defaultGetFilter }),
    detail: index_1.Get(mongoSchema_2.default, {
        id: true,
        filter: defaultGetFilter,
        populate: [['representatives', 'id, email']],
    }, 'detail'),
    put: index_1.default(async (req) => {
        const { body, params: { id }, } = req;
        return index_1.Transaction(async (session) => {
            const data = lodash_1.cloneDeep(body);
            const { name } = data;
            if (name) {
                await mongoSchema_1.default.findOneAndUpdate({ company: id }, { name }, { upsert: true, new: true, session });
            }
            const result = await utils_1.CompanySyncRepresentatives(id, data, session);
            const payload = await mongoSchema_2.default.findByIdAndUpdate(id, result, { new: true, session });
            return Promise.resolve(payload);
        });
    }),
    post: index_1.default(async (req) => {
        const { userId } = authentication_1.getTokenValidity(req);
        const user = await mongoSchema_3.default.findById(userId);
        if (user.company)
            throw new Error('The user should not have a company assigned');
        return index_1.Transaction(async (session) => {
            const [newCompany] = await mongoSchema_2.default.create([req.body], { session });
            // create or update reference
            await mongoSchema_1.default.findOneAndUpdate({ name: newCompany.name }, { company: newCompany.id }, { session, upsert: true });
            // assign company to user
            const adminRole = await mongoSchema_4.default.findOne({ value: Role_types_1.RoleValues.COMPANY_ADMIN }, null, { session });
            await mongoSchema_3.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.id, { company: newCompany.id, role: adminRole.id }, { session });
            // create verification request
            const [newVarification] = await mongoSchema_5.default.create([{ company: newCompany._id, user: user._id, expiresAt: date_fns_1.addDays(new Date(), 2) }], { session });
            await companyVerification_1.default.createRequest(newCompany, user, newVarification);
            return Promise.resolve(newCompany);
        });
    }),
};
