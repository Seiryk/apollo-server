"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joiSchema_1 = __importDefault(require("./joiSchema"));
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const CompanyReferenceActions = {
    create: async (input) => {
        const validationResult = joiSchema_1.default.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        const data = { ...input };
        return mongoSchema_1.default.create(data);
    },
    update: async (id, input) => {
        const validationResult = joiSchema_1.default.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        return mongoSchema_1.default.findByIdAndUpdate(id, input, { new: true });
    },
    remove: async (id) => mongoSchema_1.default.findByIdAndDelete(id),
};
exports.default = CompanyReferenceActions;
