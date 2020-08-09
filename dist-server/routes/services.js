"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyVerification_1 = __importDefault(require("../services/companyVerification"));
const servicesRouter = express_1.default.Router();
servicesRouter.get('/company/verify/accept', async (req, res) => {
    const token = req.query.t;
    try {
        const result = await companyVerification_1.default.verifyRequest(token);
        return res.send(result);
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        return res.send('An error has happened. Please, try again or contact the support');
    }
});
servicesRouter.get('/company/verify/reject', async (req, res) => {
    const token = req.query.t;
    try {
        const result = await companyVerification_1.default.rejectRequest(token);
        return res.send(result);
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        return res.send('An error has happened. Please, try again or contact the support');
    }
});
exports.default = servicesRouter;
