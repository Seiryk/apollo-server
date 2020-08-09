"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const CompanyReferenceInputValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    company: joi_1.default.string(),
});
exports.default = CompanyReferenceInputValidationSchema;
