"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Limited = void 0;
const authentication_1 = require("../authentication");
exports.Limited = (req, res, next) => {
    const { valid } = authentication_1.getTokenValidity(req);
    if (valid) {
        return next('route');
    }
    return next();
};
exports.default = (req, res, next) => {
    const { valid } = authentication_1.getTokenValidity(req);
    if (valid) {
        return next();
    }
    const status = 401;
    return res.status(status).json({ status, message: 'Not Authorized' });
};
