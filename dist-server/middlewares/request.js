"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationResponse_1 = __importDefault(require("../utils/validationResponse"));
exports.default = (joiSchema) => (req, res, next) => {
    if (!joiSchema) {
        return next();
    }
    const { body } = req;
    const { error } = joiSchema.validate(body, { abortEarly: false });
    if (error) {
        return validationResponse_1.default(res, error);
    }
    return next();
};
