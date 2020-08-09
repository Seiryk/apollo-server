"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
const bull_1 = __importDefault(require("bull"));
const date_fns_1 = require("date-fns");
const Company_types_1 = require("../entities/company/Company.types");
const mailerService_1 = __importDefault(require("./mailerService"));
const actions_1 = __importDefault(require("../entities/company/actions"));
const mongoSchema_1 = __importDefault(require("../entities/companyVerification/mongoSchema"));
const { JWT_SECRET, HOST, PORT, REDIS_HOST, REDIS_PASS, VERIFICATION_EMAIL, } = process.env;
const getRequestTemplate = (company, user, token) => {
    var _a, _b, _c;
    return ({
        to: VERIFICATION_EMAIL,
        subject: 'Company Verification Request',
        html: `
    <p><b>User:</b> ${user.name} ${user.surname}<p>
    <p><b>Email:</b> ${user.email}</p>
    <br>
    <h3>Company:</h3>
    <p><b>Name:</b> ${company.name}</p>
    <p><b>Email:</b> ${company.email}</p>
    <p><b>Website:</b> ${(_a = company.websiteLink) !== null && _a !== void 0 ? _a : ''}</p>
    <p><b>Employees count:</b> ${(_b = company.employeesCount) !== null && _b !== void 0 ? _b : ''}</p>
    <p><b>Description:</b> ${(_c = company.description) !== null && _c !== void 0 ? _c : ''}</p>
    <br>
    <p>Accept: <a href="http://${HOST}:${PORT}/service/company/verify/accept?t=${token}">Link</a></p>
    <p>Reject: <a href="http://${HOST}:${PORT}/service/company/verify/reject?t=${token}">Link</a></p>
  `,
    });
};
const getApproveTemplate = async (data) => {
    const rawTemplate = await fs_1.default.readFileSync(path_1.default.join(__dirname, '../templates/mail-company-approve-template.html'), 'utf8');
    const html = handlebars_1.default.compile(rawTemplate)(data);
    return {
        to: data.email,
        subject: 'Your company has been verified',
        html,
    };
};
const getRejectTemplate = async (email) => {
    const rawTemplate = await fs_1.default.readFileSync(path_1.default.join(__dirname, '../templates/mail-company-reject-template.html'), 'utf8');
    return {
        to: email,
        subject: 'Your company has been verified',
        html: rawTemplate,
    };
};
const commonRejectLogic = async (request) => {
    await actions_1.default.remove(request.company.id);
    const email = await getRejectTemplate(request.user.email);
    await mailerService_1.default.sendInQueue({ email });
    await request.remove();
};
const companyVerificationService = {
    createRequest: async (company, user, newVarification) => {
        const token = await jsonwebtoken_1.default.sign({ id: newVarification.id }, JWT_SECRET, { expiresIn: '2d' });
        const email = getRequestTemplate(company, user, token);
        await mailerService_1.default.sendInQueue({
            email,
            callback: (info) => console.log(`Company verification request mail ${info.messageId} was sent`),
        });
    },
    verifyRequest: async (token) => {
        try {
            await jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (e) {
            return 'Invalid token';
        }
        const data = jsonwebtoken_1.default.decode(token);
        const verificationRequest = await mongoSchema_1.default.findById(data.id).populate(['company', 'user']);
        await verificationRequest.company.updateOne({ status: Company_types_1.CompanyStatuses.ACTIVE });
        const email = await getApproveTemplate({ CompanyName: verificationRequest.company.name, email: verificationRequest.user.email });
        await mailerService_1.default.sendInQueue({ email });
        verificationRequest.remove(verificationRequest.id);
        return 'The company was successfully verified.';
    },
    rejectRequest: async (token) => {
        try {
            await jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (e) {
            return 'Invalid token';
        }
        const data = jsonwebtoken_1.default.decode(token);
        const verificationRequest = await mongoSchema_1.default.findById(data.id).populate(['company', 'user']);
        await commonRejectLogic(verificationRequest);
        return 'The unverified company was successfully removed.';
    },
};
const checkRequestsQueue = new bull_1.default('checkCompanyVerificationRequests', {
    redis: {
        host: REDIS_HOST,
        port: 6379,
        password: REDIS_PASS,
    },
});
checkRequestsQueue.process(async () => {
    const allRequests = await mongoSchema_1.default.find();
    allRequests.forEach((doc) => {
        doc.populate('company').populate('user');
        if (date_fns_1.isPast(doc.expiresAt)) {
            (async () => commonRejectLogic(doc))();
            // eslint-disable-next-line no-console
            console.log(`a verification request for company ${doc.company.id} has expired`);
        }
    });
});
// do check every two hours
checkRequestsQueue.add({}, { repeat: { cron: '0 0/2 * * *' } });
exports.default = companyVerificationService;
