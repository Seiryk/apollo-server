"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
exports.default = {
    create: (input) => mongoSchema_1.default.create(input),
    remove: (id) => mongoSchema_1.default.findByIdAndDelete(id),
};
