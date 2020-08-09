"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const constants_1 = require("../constants");
const { JWT_SECRET, REDIRECT_URL } = process.env;
const router = express_1.default.Router();
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/cb', passport_1.default.authenticate('google'), (req, res) => {
    const token = jsonwebtoken_1.default.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${REDIRECT_URL}?${constants_1.HEADER_TOKEN}=${token}`);
});
exports.default = router;
