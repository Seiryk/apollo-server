"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
exports.default = {
    Query: {
        role: (root, args) => mongoSchema_1.default.findById(args.id),
        roles: (root, args) => mongoSchema_1.default.find({}),
    },
};
