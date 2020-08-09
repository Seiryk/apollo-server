"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
// ?$top=10
// ->
// query.top(10)
exports.default = (query, top) => new Promise((resolve) => {
    if (lodash_1.isNaN(+top)) {
        return resolve();
    }
    if (top <= 0) {
        return resolve();
    }
    query.limit(top);
    return resolve();
});
