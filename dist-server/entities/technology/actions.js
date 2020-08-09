"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joiSchema_1 = __importDefault(require("./joiSchema"));
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const TechnologyActions = {
    create: (input) => {
        const validationResult = joiSchema_1.default.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        return mongoSchema_1.default.create(input);
    },
    update: (id, input) => {
        const validationResult = joiSchema_1.default.validate(input);
        if (validationResult.error)
            throw validationResult.error;
        return mongoSchema_1.default.findByIdAndUpdate(id, input, { new: true });
    },
    removeTechnology: (id) => mongoSchema_1.default.findByIdAndDelete(id),
};
exports.default = TechnologyActions;
