"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFilterQuery_1 = __importDefault(require("../../utils/getFilterQuery"));
describe('getFilterQuery', () => {
    it('properly parses query object', () => {
        const queryObject = {
            name: 'string',
            params: ['param1', 'param2'],
        };
        const expected = {
            name: { $regex: new RegExp(queryObject.name, 'i') },
            params: { $in: queryObject.params },
        };
        const res = getFilterQuery_1.default(queryObject);
        expect(res).toMatchObject(expected);
    });
    it('ignores fuzzy keys', () => {
        const queryObject = {
            name: 'string',
            params: ['param1', 'param2'],
        };
        const options = { fuzzy: ['name'] };
        const expected = {
            params: { $in: queryObject.params },
        };
        const res = getFilterQuery_1.default(queryObject, options);
        expect(res).toMatchObject(expected);
    });
});
