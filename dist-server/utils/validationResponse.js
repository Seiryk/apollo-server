"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getJoiErrors_1 = __importDefault(require("./getJoiErrors"));
exports.default = (res, error) => (res
    .status(422)
    .json({
    status: 422,
    errors: getJoiErrors_1.default(error.details),
})
    .end());
