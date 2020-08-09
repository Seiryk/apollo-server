"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = new mongoose_1.default.Schema({
    googleId: String,
    email: {
        type: String,
        unique: true,
    },
    surname: String,
    name: String,
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
    },
}, {
    timestamps: true,
});
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
