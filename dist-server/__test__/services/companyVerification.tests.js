"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _utils_1 = require("../test-utils/_utils");
const mongoSchema_1 = __importDefault(require("../../entities/company/mongoSchema"));
const mongoSchema_2 = __importDefault(require("../../entities/user/mongoSchema"));
const companyVerification_1 = __importDefault(require("../../services/companyVerification"));
const mongoSchema_3 = __importDefault(require("../../entities/companyVerification/mongoSchema"));
const mailerService_1 = __importDefault(require("../../services/mailerService"));
const Company_types_1 = require("../../entities/company/Company.types");
jest.mock('../../services/mailerService');
describe('CompanyVerification', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(`mongodb://${global.DB_USERNAME}:${global.DB_PASSWORD}@${global.DB_HOST}:${global.DB_PORT}/${global.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        await _utils_1.removeAllTestCollections();
        await _utils_1.preFillDB();
    });
    it('creates verification request', async () => {
        const company = await mongoSchema_1.default.findOne({});
        const user = await mongoSchema_2.default.findOne({});
        // @ts-ignore
        await companyVerification_1.default.createRequest(company, user);
        expect(mailerService_1.default.sendInQueue).toBeCalledTimes(1);
        const companyVerificationRequest = await mongoSchema_3.default.findOne({ company: company.id });
        expect(companyVerificationRequest.user.toString()).toEqual(user.id);
    });
    it('accepts verification request', async () => {
        mongoSchema_3.default.prototype.remove = jest.fn(() => true);
        // takes request from the first test
        const companyVerificationRequest = await mongoSchema_3.default.findOne({});
        const token = await jsonwebtoken_1.default.sign({ id: companyVerificationRequest.id }, 'ttttttt', { expiresIn: '2d' });
        const result = await companyVerification_1.default.verifyRequest(token);
        expect(result).toEqual('The company was successfully verified.');
        expect(mongoSchema_3.default.prototype.remove).toHaveBeenCalledTimes(1);
        const company = await mongoSchema_1.default.findById(companyVerificationRequest.company);
        expect(company.status).toEqual(Company_types_1.CompanyStatuses.ACTIVE);
    });
    it('rejects verification request', async () => {
        mongoSchema_3.default.prototype.remove = jest.fn(() => true);
        // takes request from the first test
        const companyVerificationRequest = await mongoSchema_3.default.findOne({});
        const token = await jsonwebtoken_1.default.sign({ id: companyVerificationRequest.id }, 'ttttttt', { expiresIn: '2d' });
        const result = await companyVerification_1.default.rejectRequest(token);
        expect(result).toEqual('The unverified company was successfully removed.');
        expect(mongoSchema_3.default.prototype.remove).toHaveBeenCalledTimes(1);
        const company = await mongoSchema_1.default.findById(companyVerificationRequest.company);
        expect(company).toBeFalsy();
    });
    afterAll(async () => {
        await _utils_1.removeAllTestCollections();
        await mongoose_1.default.disconnect();
    });
});
