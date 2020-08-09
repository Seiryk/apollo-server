"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthCallback = exports.getOrCreateUser = exports.getTokenValidity = void 0;
/* eslint-disable no-empty */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const get_1 = __importDefault(require("lodash/get"));
const mongoSchema_1 = __importDefault(require("./entities/user/mongoSchema"));
const constants_1 = require("./constants");
const { JWT_SECRET } = process.env;
exports.getTokenValidity = (request) => {
    const headerToken = request.headers[constants_1.HEADER_TOKEN];
    let user = null;
    let valid;
    try {
        const isValid = jsonwebtoken_1.default.verify(headerToken, JWT_SECRET);
        user = jsonwebtoken_1.default.decode(headerToken);
        valid = !!isValid;
    }
    catch (error) {
        valid = false;
    }
    return { userId: user === null || user === void 0 ? void 0 : user.id, valid };
};
exports.getOrCreateUser = async (profile) => {
    const user = {
        email: profile._json.email,
        googleId: profile.id,
        name: get_1.default(profile, 'name.givenName', ''),
        surname: get_1.default(profile, 'name.familyName', ''),
    };
    let result;
    result = await mongoSchema_1.default.findOne({ email: user.email });
    if (!result) {
        result = await mongoSchema_1.default.create(user);
    }
    else if (!result.googleId) {
        result = await mongoSchema_1.default.findOneAndUpdate({ email: { $eq: user.email } }, user, { new: true });
    }
    return result;
};
exports.googleAuthCallback = async (accessToken, refreshToken, profile, next) => {
    try {
        const user = await exports.getOrCreateUser(profile);
        // ToDo: an entire doc is stored in the token, that's bollocks, needs to be reworked
        next(null, user);
    }
    catch (error) {
        next(error);
    }
};
