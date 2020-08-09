"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const getFilterQuery = (args = {}, options) => {
    const entries = Object.entries(args);
    const query = {};
    entries.forEach((entry) => {
        const [key, value] = entry;
        if (options === null || options === void 0 ? void 0 : options.fuzzy.includes(key))
            return;
        switch (typeof value) {
            case 'string': {
                query[key] = { $regex: new RegExp(value, 'i') };
                break;
            }
            case 'object': {
                if (Array.isArray(value) && !isEmpty_1.default(value)) {
                    query[key] = { $in: value };
                }
                break;
            }
            default:
                break;
        }
    });
    return query;
};
exports.default = getFilterQuery;
