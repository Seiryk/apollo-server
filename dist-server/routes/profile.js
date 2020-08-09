"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../controllers/profile/index"));
const profileRequest_1 = __importDefault(require("../middlewares/profileRequest"));
const rbac_1 = __importDefault(require("../middlewares/rbac"));
const router = express_1.Router();
exports.default = router
    .get('/', index_1.default.get)
    .get('/:id', index_1.default.detail)
    .post('/', profileRequest_1.default.post, index_1.default.post)
    .put('/:id', profileRequest_1.default.put, index_1.default.put)
    .put('/:id/status', profileRequest_1.default.status, index_1.default.status)
    .delete('/:id', rbac_1.default('profile'), index_1.default.delete);
