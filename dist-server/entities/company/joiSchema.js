"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyUpdateInputValidationSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const CompanyInputValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    slogan: joi_1.default.string(),
    description: joi_1.default.string(),
    employeesCount: joi_1.default.number().integer(),
    email: joi_1.default.string().email().required(),
    websiteLink: joi_1.default.string(),
    images: joi_1.default.array().items(joi_1.default.string()),
    locations: joi_1.default.array().items(joi_1.default.object({
        city: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
    })),
    representatives: joi_1.default.array().items(joi_1.default.string()),
}).unknown(true);
exports.CompanyUpdateInputValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).optional(),
    slogan: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    employeesCount: joi_1.default.number().optional(),
    email: joi_1.default.string().email().optional(),
    websiteLink: joi_1.default.string().optional(),
    images: joi_1.default.array().optional().items(joi_1.default.string()),
    locations: joi_1.default.array().items(joi_1.default.object({
        city: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
    })),
    representatives: joi_1.default.array().optional().items(joi_1.default.string()),
}).unknown(true);
exports.default = CompanyInputValidationSchema;
