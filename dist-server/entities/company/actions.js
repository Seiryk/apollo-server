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
const mongoose_1 = require("mongoose");
const joiSchema_1 = __importStar(require("./joiSchema"));
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const mongoSchema_2 = __importDefault(require("../user/mongoSchema"));
const Company_types_1 = require("./Company.types");
const mongoSchema_3 = __importDefault(require("../companyReference/mongoSchema"));
const actions_1 = __importDefault(require("../companyReference/actions"));
const mongoSchema_4 = __importDefault(require("../role/mongoSchema"));
const Role_types_1 = require("../role/Role.types");
const companyVerification_1 = __importDefault(require("../../services/companyVerification"));
const CompanyActions = {
    create: async (input, { user }) => {
        if (user.company)
            throw new mongoose_1.Error('The user should not have a company assigned');
        const validationResult = joiSchema_1.default.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        const newCompany = await mongoSchema_1.default.create(input);
        // create or update reference
        const existingReference = await mongoSchema_3.default.findOne({ name: newCompany.name });
        if (existingReference) {
            await existingReference.update({ company: newCompany.id });
        }
        else {
            await actions_1.default.create({ name: newCompany.name, company: newCompany.id });
        }
        // assign company to user
        const adminRole = await mongoSchema_4.default.findOne({ value: Role_types_1.RoleValues.COMPANY_ADMIN });
        await mongoSchema_2.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.id, { company: newCompany.id, role: adminRole.id });
        // create verification request
        // @ts-ignore
        await companyVerification_1.default.createRequest(newCompany, user);
        return newCompany;
    },
    update: async (id, input) => {
        const validationResult = joiSchema_1.CompanyUpdateInputValidationSchema.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        const data = { ...input };
        return mongoSchema_1.default.findByIdAndUpdate(id, { ...data }, { new: true });
    },
    updateStatus: async (id, status) => {
        if (!Company_types_1.CompanyStatuses[status])
            throw new mongoose_1.Error('Invalid status provided');
        return mongoSchema_1.default.findByIdAndUpdate(id, { status: Company_types_1.CompanyStatuses[status] }, { new: true });
    },
    remove: async (id) => {
        // reset company and roles in the company's users
        const defaultRole = await mongoSchema_4.default.findOne({ value: Role_types_1.RoleValues.REPRESENTATIVE });
        await mongoSchema_2.default.updateMany({ company: id }, { company: null, role: defaultRole.id });
        // remove id from the company reference
        await mongoSchema_3.default.updateOne({ company: id }, { company: null });
        return mongoSchema_1.default.findByIdAndRemove(id);
    },
};
exports.default = CompanyActions;
