"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../authentication");
const mongoSchema_1 = __importDefault(require("../entities/user/mongoSchema"));
const mongoSchema_2 = __importDefault(require("../entities/profile/mongoSchema"));
const mongoSchema_3 = __importDefault(require("../entities/company/mongoSchema"));
exports.default = (type) => (req, res, next) => {
    const { userId } = authentication_1.getTokenValidity(req);
    const { params: { id }, } = req;
    if (!userId) {
        return res.status(403).json({ status: 403, message: 'Not Allowed' }).end();
    }
    return mongoSchema_1.default.findById(userId)
        .populate('role', 'value')
        .then((user) => {
        const { role: { value }, company, } = user;
        if (!company) {
            return res.status(403).json({ status: 403, message: 'Not Allowed' }).end();
        }
        const userCompany = company.toHexString();
        if (type === 'profile') {
            mongoSchema_2.default.findById(id)
                .then((profile) => {
                if (profile && userCompany === profile.company.toHexString() && [1, 2].includes(2)) {
                    return next();
                }
                return res.status(403).json({ status: 403, message: 'Not Allowed' }).end();
            })
                .catch((e) => res.status(400).json({ status: 400, errors: e }).end());
        }
        if (type === 'company') {
            mongoSchema_3.default.findById(id)
                .then((company) => {
                if (company && userCompany === company._id.toHexString() && value === 2) {
                    return next();
                }
                return res.status(403).json({ status: 403, message: 'Not Allowed' }).end();
            })
                .catch((e) => res.status(400).json({ status: 400, errors: e }).end());
        }
        return user;
    })
        .catch((e) => res.status(400).json({ status: 400, errors: e }).end());
};
