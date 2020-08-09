"use strict";
// Operator  Description             Example
// Comparison Operators
// eq        Equal                   Address/City eq 'Redmond'
// ne        Not equal               Address/City ne 'London'
// gt        Greater than            Price gt 20
// ge        Greater than or equal   Price ge 10
// lt        Less than               Price lt 20
// le        Less than or equal      Price le 100
// in        In                      Name in ['Test', 'Different Name', 100]
// Logical Operators
// and       Logical and             Price le 200 and Price gt 3.5
// or        Logical or              Price le 3.5 or Price gt 200     #todo at the moment works like `and`
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eg.
//   http://host/service/Products?$filter=Price lt 10.00
//   http://host/service/Categories?$filter=Products/$count lt 10
const functionsParser_1 = __importDefault(require("./functionsParser"));
const utils_1 = require("../utils");
const OPERATORS_KEYS = ['eq', 'ne', 'gt', 'ge', 'lt', 'le', 'has', 'in'];
const stringHelper = {
    has: (str, key) => str.indexOf(key) >= 0,
    isBeginWith: (str, key) => str.indexOf(key) === 0,
    isEndWith: (str, key) => str.lastIndexOf(key) === str.length - key.length,
    removeEndOf: (str, key) => {
        if (stringHelper.isEndWith(str, key)) {
            return str.substr(0, str.length - key.length);
        }
        return str;
    },
};
const validator = {
    formatValue: (value) => {
        let val;
        if (value === 'true') {
            val = true;
        }
        else if (value === 'false') {
            val = false;
            // eslint-disable-next-line
        }
        else if (+value === +value) {
            val = +value;
        }
        else if (stringHelper.isBeginWith(value, "'") && stringHelper.isEndWith(value, "'")) {
            val = value.slice(1, -1);
        }
        else if (value === 'null') {
            val = value;
        }
        else if ((stringHelper.isBeginWith(value, '[') && stringHelper.isEndWith(value, ']'))) {
            val = value.slice(1, -1).replace(/'/gmi, '').replace(/, ?/g, '%').split('%');
        }
        else {
            return { err: new Error(`Syntax error at '${value}'.`) };
        }
        return { val };
    },
};
exports.default = (query, $filter) => new Promise((resolve, reject) => {
    if (!$filter) {
        return resolve();
    }
    const condition = utils_1.split($filter, ['and', 'or']).filter((item) => item !== 'and' && item !== 'or');
    condition.map((item) => {
        // parse "indexof(title,'X1ML') gt 0"
        const conditionArr = utils_1.split(item, OPERATORS_KEYS);
        if (conditionArr.length === 0) {
            // parse "contains(title,'X1ML')"
            conditionArr.push(item);
        }
        if (conditionArr.length !== 3 && conditionArr.length !== 1) {
            return reject(new Error(`Syntax error at '${item}'.`));
        }
        let key = conditionArr[0];
        const [, odataOperator, value] = conditionArr;
        if (key === 'id') {
            key = '_id';
        }
        let val;
        if (value !== undefined) {
            const result = validator.formatValue(value);
            if (result.err) {
                return reject(result.err);
            }
            val = result.val;
        }
        // function query
        const functionKey = key.substring(0, key.indexOf('('));
        if (['indexof', 'year', 'contains'].indexOf(functionKey) > -1) {
            functionsParser_1.default[functionKey](query, key, odataOperator, val);
        }
        else {
            if (conditionArr.length === 1) {
                return reject(new Error(`Syntax error at '${item}'.`));
            }
            if (value === 'null') {
                switch (odataOperator) {
                    case 'eq':
                        query.exists(key, false);
                        return resolve();
                    case 'ne':
                        query.exists(key, true);
                        return resolve();
                    default:
                        break;
                }
            }
            // operator query
            switch (odataOperator) {
                case 'eq':
                    // query.match({ 'experience.company.name': 'Tarasov Inc.' });
                    // query.match({ key: val });
                    break;
                case 'ne':
                    query.where(key).ne(val);
                    break;
                case 'gt':
                    query.where(key).gt(val);
                    break;
                case 'ge':
                    query.where(key).gte(val);
                    break;
                case 'lt':
                    query.where(key).lt(val);
                    break;
                case 'le':
                    query.where(key).lte(val);
                    break;
                case 'in':
                    query.where(key).in(val);
                    break;
                default:
                    return reject(new Error("Incorrect operator at '#{item}'."));
            }
        }
        return undefined;
    });
    return resolve();
});
