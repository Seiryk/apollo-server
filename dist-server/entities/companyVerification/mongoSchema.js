"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const companyVerificationSchema = new mongoose_1.default.Schema({
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    expiresAt: Date,
}, {
    timestamps: true,
});
const CompanyVerificationModel = mongoose_1.default.model('CompanyVerification', companyVerificationSchema, 'CompanyVerification');
exports.default = CompanyVerificationModel;
