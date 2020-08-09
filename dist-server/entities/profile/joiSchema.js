"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUpdateInputValidationSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const joiSchema_1 = __importDefault(require("../position/joiSchema"));
const joiSchema_2 = __importDefault(require("../companyReference/joiSchema"));
const joiSchema_3 = __importDefault(require("../technology/joiSchema"));
const ExperienceInputValidationSchema = joi_1.default.object({
    workType: joi_1.default.string().required(),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().required(),
    company: joi_1.default.string().when('companyNew', { is: joi_1.default.exist(), then: joi_1.default.optional(), otherwise: joi_1.default.required() }),
    companyNew: joiSchema_2.default.optional(),
    city: joi_1.default.string(),
    country: joi_1.default.string(),
    position: joi_1.default.string(),
});
const EducationInputValidationSchema = joi_1.default.object({
    course: joi_1.default.string().required(),
    degree: joi_1.default.string().required(),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().optional(),
    city: joi_1.default.string(),
    country: joi_1.default.string(),
});
const ProfileInputValidationSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    surname: joi_1.default.string().required(),
    workType: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    summary: joi_1.default.string().optional(),
    status: joi_1.default.string().optional(),
    salaryMin: joi_1.default.number().optional(),
    salaryMax: joi_1.default.number().optional(),
    expertise: joi_1.default.array().items(joi_1.default.string()).min(1)
        .when('expertiseNew', { is: joi_1.default.exist(), then: joi_1.default.optional(), otherwise: joi_1.default.required() }),
    expertiseNew: joi_1.default.array().items(joiSchema_3.default).optional().min(1),
    city: joi_1.default.string().optional(),
    country: joi_1.default.string().optional(),
    position: joi_1.default.string().when('positionNew', { is: joi_1.default.exist(), then: joi_1.default.forbidden(), otherwise: joi_1.default.required() }),
    positionNew: joiSchema_1.default.optional(),
    education: joi_1.default.array().items(EducationInputValidationSchema).optional(),
    experience: joi_1.default.array().items(ExperienceInputValidationSchema).optional(),
});
exports.ProfileUpdateInputValidationSchema = joi_1.default.object({
    name: joi_1.default.string(),
    surname: joi_1.default.string(),
    workType: joi_1.default.string(),
    email: joi_1.default.string().email(),
    summary: joi_1.default.string().optional(),
    status: joi_1.default.string().optional(),
    salaryMin: joi_1.default.number().optional(),
    salaryMax: joi_1.default.number().optional(),
    expertise: joi_1.default.array().items(joi_1.default.string()).min(1).when('expertiseNew', {
        is: joi_1.default.exist(),
        then: joi_1.default.required().messages({
            'any.required': 'The existing expertise array is required when providing expertiseNew in update',
        }),
        otherwise: joi_1.default.optional(),
    }),
    expertiseNew: joi_1.default.array().items(joiSchema_3.default).optional().min(1),
    city: joi_1.default.string().optional(),
    country: joi_1.default.string().optional(),
    position: joi_1.default.string().optional(),
    positionNew: joiSchema_1.default.optional(),
    education: joi_1.default.array().items(EducationInputValidationSchema).optional(),
    experience: joi_1.default.array().items(ExperienceInputValidationSchema).optional(),
});
exports.default = ProfileInputValidationSchema;
