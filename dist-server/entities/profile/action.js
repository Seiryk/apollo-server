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
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const actions_1 = __importDefault(require("../position/actions"));
const mongoSchema_2 = __importDefault(require("../position/mongoSchema"));
const createOrGetEntity_1 = __importDefault(require("../../utils/createOrGetEntity"));
const actions_2 = __importDefault(require("../companyReference/actions"));
const mongoSchema_3 = __importDefault(require("../companyReference/mongoSchema"));
const joiSchema_1 = __importStar(require("./joiSchema"));
const actions_3 = __importDefault(require("../technology/actions"));
const mongoSchema_4 = __importDefault(require("../technology/mongoSchema"));
const createExperience = async (item) => {
    const newItem = { ...item };
    if (item.companyNew) {
        const newEntity = await createOrGetEntity_1.default(item.companyNew, actions_2.default, mongoSchema_3.default);
        newItem.company = newEntity.id;
        delete newItem.companyNew;
    }
    return newItem;
};
const handleFieldsWithNewEntities = async (data) => {
    const newData = { ...data };
    if (newData.expertiseNew) {
        const newExpertisesIds = await Promise.all(newData.expertiseNew.map(async (expertiseInput) => {
            const newExpertise = await createOrGetEntity_1.default(expertiseInput, actions_3.default, mongoSchema_4.default);
            return newExpertise.id;
        }));
        newData.expertise = newData.expertise ? [...newData.expertise, ...newExpertisesIds] : newExpertisesIds;
        delete newData.expertiseNew;
    }
    if (newData.positionNew) {
        const newItem = await createOrGetEntity_1.default(newData.positionNew, actions_1.default, mongoSchema_2.default);
        newData.position = newItem.id;
        delete newData.positionNew;
    }
    if (newData.experience) {
        newData.experience = await Promise.all(newData.experience.map(async (item) => createExperience(item)));
    }
    return newData;
};
const ProfileActions = {
    create: async (input, { user }) => {
        if (!user || !user.company)
            throw new Error('The user should be in a company');
        const validationResult = joiSchema_1.default.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        let data = { ...input };
        data.status = data.status || 'active';
        data = await handleFieldsWithNewEntities(data);
        return mongoSchema_1.default.create({ ...data, company: user.company });
    },
    update: async (id, input, { user }) => {
        if (!user || !user.company)
            throw new Error('The user should be in a company');
        const validationResult = joiSchema_1.ProfileUpdateInputValidationSchema.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        const existingProfile = await mongoSchema_1.default.findById(id);
        if (!user || !user.company || user.company.toHexString() !== existingProfile.company.toHexString()) {
            throw new Error('The user must be in the same company');
        }
        const preparedData = await handleFieldsWithNewEntities(input);
        return mongoSchema_1.default.findByIdAndUpdate(id, preparedData, { new: true });
    },
    remove: async (id, { user }) => {
        if (!user.company)
            throw new Error('The user should be in a company');
        const existingProfile = await mongoSchema_1.default.findById(id);
        if (!user || user.company.toHexString() !== existingProfile.company.toHexString()) {
            throw new Error('The user must be in the same company');
        }
        return existingProfile.remove();
    },
};
exports.default = ProfileActions;
