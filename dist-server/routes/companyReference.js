"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyReference_1 = __importDefault(require("../controllers/companyReference"));
const router = express_1.Router();
exports.default = router
    .get('/', companyReference_1.default.get)
    .get('/:id', companyReference_1.default.detail);
