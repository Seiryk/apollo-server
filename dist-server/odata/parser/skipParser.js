"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
// ?$skip=10
// ->
// query.skip(10)
exports.default = (query, skip) => new Promise((resolve) => {
    if (lodash_1.isNaN(+skip)) {
        return resolve();
    }
    if (skip <= 0) {
        return resolve();
    }
    query.skip(skip);
    return resolve();
});
