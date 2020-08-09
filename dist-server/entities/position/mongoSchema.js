"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const positionSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
});
const PositionModel = mongoose_1.default.model('Position', positionSchema, 'Position');
exports.default = PositionModel;
