"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const mongoSchema_2 = __importDefault(require("../company/mongoSchema"));
const mongoSchema_3 = __importDefault(require("../role/mongoSchema"));
exports.default = {
    Query: {
        user: (root, args) => mongoSchema_1.default.findById(args.id),
    },
    User: {
        company: async (parent) => mongoSchema_2.default.findById(parent.company),
        role: async (parent) => mongoSchema_3.default.findById(parent.role),
    },
};
