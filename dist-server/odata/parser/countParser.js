"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filterParser_1 = __importDefault(require("./filterParser"));
// ?$count=10
// ->
// query.count(10)
exports.default = (mongooseModel, $count, $filter) => new Promise((resolve, reject) => {
    if ($count === undefined) {
        return resolve();
    }
    switch ($count) {
        case 'true': {
            const query = mongooseModel.find();
            filterParser_1.default(query, $filter);
            query.countDocuments((err, count) => {
                resolve(count);
            });
            break;
        }
        case 'false':
            resolve();
            break;
        default:
            reject(new Error('Unknown $count option, only "true" and "false" are supported.'));
            break;
    }
    return undefined;
});
