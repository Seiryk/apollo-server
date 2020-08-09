"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth_1 = require("passport-google-oauth");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
exports.default = (callback) => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.use(new passport_google_oauth_1.OAuth2Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/cb',
    }, callback));
};
