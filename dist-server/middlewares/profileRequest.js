"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const request_1 = __importDefault(require("./request"));
const joiObjectId_1 = __importDefault(require("../utils/joiObjectId"));
const Education = joi_1.default.object({
    startDate: joi_1.default.date(),
    endDate: joi_1.default.date(),
    degree: joi_1.default.string(),
    course: joi_1.default.string(),
    country: joi_1.default.string(),
    city: joi_1.default.string(),
});
const Experience = joi_1.default.object({
    position: joi_1.default.string().required(),
    company: joi_1.default.string().required(),
    workType: joi_1.default.string().required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
    country: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
});
const Store = joi_1.default.object({
    name: joi_1.default.string().required(),
    surname: joi_1.default.string().required(),
    workType: joi_1.default.string().required(),
    company: joi_1.default.string().required(),
    city: joi_1.default.string(),
    country: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    position: joi_1.default.string().required(),
    summary: joi_1.default.string(),
    salaryMin: joi_1.default.number().min(0),
    salaryMax: joi_1.default.number().min(0),
    expertise: joi_1.default.array().items(joiObjectId_1.default, joi_1.default.string()).min(1).required(),
    education: joi_1.default.array().items(Education),
    experience: joi_1.default.array().items(Experience).min(1).required(),
});
const Update = joi_1.default.object({
    name: joi_1.default.string(),
    surname: joi_1.default.string(),
    workType: joi_1.default.string(),
    company: joi_1.default.string(),
    city: joi_1.default.string(),
    country: joi_1.default.string(),
    email: joi_1.default.string().email(),
    position: joi_1.default.string(),
    summary: joi_1.default.string(),
    salaryMin: joi_1.default.number().min(0),
    salaryMax: joi_1.default.number().min(0),
    expertise: joi_1.default.array().items(joiObjectId_1.default, joi_1.default.string()).min(1),
    education: joi_1.default.array().items(Education),
    experience: joi_1.default.array().items(Experience).min(1),
});
const Status = joi_1.default.object({
    status: joi_1.default.string().valid('active', 'hired').required(),
});
exports.default = {
    post: request_1.default(Store),
    put: request_1.default(Update),
    status: request_1.default(Status),
};
