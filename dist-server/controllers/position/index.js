"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const mongoSchema_1 = __importDefault(require("../../entities/position/mongoSchema"));
exports.default = {
    get: index_1.Get(mongoSchema_1.default),
    detail: index_1.Get(mongoSchema_1.default, { id: true }, 'detail'),
};
