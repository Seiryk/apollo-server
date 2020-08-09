"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_1 = __importDefault(require("../controllers/company"));
const companyRequest_1 = __importDefault(require("../middlewares/companyRequest"));
const rbac_1 = __importDefault(require("../middlewares/rbac"));
const router = express_1.Router();
exports.default = router
    .get('/', company_1.default.get)
    .get('/:id', company_1.default.detail)
    .put('/:id', rbac_1.default('company'), companyRequest_1.default.put, company_1.default.put)
    .post('/', companyRequest_1.default.post, company_1.default.post);
