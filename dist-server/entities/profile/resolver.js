"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const mongoSchema_2 = __importDefault(require("../company/mongoSchema"));
const mongoSchema_3 = __importDefault(require("../technology/mongoSchema"));
const getPaginatedList_1 = require("../../utils/getPaginatedList");
const getFilterQuery_1 = __importDefault(require("../../utils/getFilterQuery"));
const mongoSchema_4 = __importDefault(require("../position/mongoSchema"));
const action_1 = __importDefault(require("./action"));
const fuzzyUtils_1 = __importDefault(require("../../vendors/mongoose-fuzzy-searching/fuzzyUtils"));
const mongoSchema_5 = __importDefault(require("../companyReference/mongoSchema"));
exports.default = {
    Query: {
        profile: async (root, { id }) => mongoSchema_1.default.findById(id),
        profiles: async (root, { searchFilters, page, limit }) => {
            const query = getFilterQuery_1.default(searchFilters, { fuzzy: ['city'] });
            const fuzzySearch = fuzzyUtils_1.default.createFuzzySearchString([searchFilters === null || searchFilters === void 0 ? void 0 : searchFilters.city]);
            return getPaginatedList_1.getFuzzySearchedPaginatedList(mongoSchema_1.default, fuzzySearch, { page, limit }, query);
        },
    },
    Mutation: {
        addProfile: async (root, { input }, ctx) => action_1.default.create(input, ctx),
        updateProfile: async (root, { id, input }, ctx) => action_1.default.update(id, input, ctx),
        removeProfile: async (root, { id }, ctx) => action_1.default.remove(id, ctx),
    },
    Profile: {
        company: async (parent) => mongoSchema_2.default.findById(parent.company),
        position: async (parent) => mongoSchema_4.default.findById(parent.position),
        expertise: async (parent) => mongoSchema_3.default.find().where('_id').in(parent.expertise).exec(),
    },
    Experience: {
        company: async (parent) => mongoSchema_5.default.findById(parent.company),
    },
};
