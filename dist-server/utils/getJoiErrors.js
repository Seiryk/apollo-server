"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (errors) => (errors.reduce((acc, { path, message }) => {
    acc[path.join('.')] = message;
    return acc;
}, {}));
