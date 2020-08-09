"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectId = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
exports.isObjectId = (value) => (/^[0-9a-fA-F]{24}$/.test(value));
exports.default = joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id');
