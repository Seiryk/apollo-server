"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const countParser_1 = __importDefault(require("../../odata/parser/countParser"));
const filterParser_1 = __importDefault(require("../../odata/parser/filterParser"));
const skipParser_1 = __importDefault(require("../../odata/parser/skipParser"));
const topParser_1 = __importDefault(require("../../odata/parser/topParser"));
exports.default = async (Model, query, queryString, options) => {
    const { limited } = options;
    const { $count, $filter } = queryString;
    let { $top = 10, $skip } = queryString;
    let count;
    $top = +$top;
    $skip = +$skip;
    if (limited && $top < $skip) {
        throw new Error('you need to authorize to continue');
    }
    if (!lodash_1.isEmpty($filter)) {
        await filterParser_1.default(query, $filter);
    }
    if (!lodash_1.isEmpty($count)) {
        count = await countParser_1.default(Model, $count, $filter);
    }
    if (!lodash_1.isNaN($skip)) {
        await skipParser_1.default(query, $skip);
    }
    if (!lodash_1.isNaN($top)) {
        await topParser_1.default(query, $top);
    }
    if ($count) {
        const data = await query;
        return { count, payload: data };
    }
    const data = await query;
    return {
        payload: data,
    };
};
