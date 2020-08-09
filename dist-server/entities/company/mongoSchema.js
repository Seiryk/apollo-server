"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Company_types_1 = require("./Company.types");
const companySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
    },
    slogan: String,
    description: String,
    employeesCount: Number,
    email: String,
    websiteLink: String,
    locations: [{
            city: String,
            country: String,
        }],
    images: [String],
    representatives: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: mongoose_1.default.Schema.Types.Number, default: Company_types_1.CompanyStatuses.UNVERIFIED },
}, {
    timestamps: true,
});
const CompanyModel = mongoose_1.default.model('Company', companySchema, 'Company');
exports.default = CompanyModel;
