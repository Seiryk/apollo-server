"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const request_1 = __importDefault(require("./request"));
const joiObjectId_1 = __importDefault(require("../utils/joiObjectId"));
const Update = joi_1.default.object({
    name: joi_1.default.string(),
    images: joi_1.default.array().items(joi_1.default.string()),
    email: joi_1.default.string().email(),
    description: joi_1.default.string(),
    slogan: joi_1.default.string(),
    employeesCount: joi_1.default.number(),
    representatives: joi_1.default.array().items(joiObjectId_1.default, joi_1.default.string().email()),
    websiteLink: joi_1.default.string(),
    locations: joi_1.default.array().items(joi_1.default.object({ city: joi_1.default.string(), country: joi_1.default.string().required() })),
});
const Create = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    employeesCount: joi_1.default.number().required(),
    description: joi_1.default.string().required(),
    websiteLink: joi_1.default.string().required(),
});
exports.default = {
    put: request_1.default(Update),
    post: request_1.default(Create),
};
