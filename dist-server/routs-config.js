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
const passport_1 = __importDefault(require("passport"));
const auth_config_1 = __importDefault(require("./auth-config"));
const authentication_1 = require("./authentication");
const auth_1 = __importStar(require("./middlewares/auth"));
const profile_1 = __importDefault(require("./controllers/profile"));
const authentication_2 = __importDefault(require("./routes/authentication"));
const services_1 = __importDefault(require("./routes/services"));
const profile_2 = __importDefault(require("./routes/profile"));
const company_1 = __importDefault(require("./routes/company"));
const position_1 = __importDefault(require("./routes/position"));
const companyReference_1 = __importDefault(require("./routes/companyReference"));
const technology_1 = __importDefault(require("./routes/technology"));
exports.default = (app) => {
    auth_config_1.default(authentication_1.googleAuthCallback);
    app.use(passport_1.default.initialize());
    app.use('/auth', authentication_2.default);
    app.use('/service', services_1.default);
    app.get('/api/v1/profile', auth_1.Limited, profile_1.default.limited);
    app.use('/api/v1/profile', auth_1.default, profile_2.default);
    app.use('/api/v1/company', auth_1.default, company_1.default);
    app.use('/api/v1/position', auth_1.default, position_1.default);
    app.use('/api/v1/company-reference', auth_1.default, companyReference_1.default);
    app.use('/api/v1/technology', auth_1.default, technology_1.default);
};
