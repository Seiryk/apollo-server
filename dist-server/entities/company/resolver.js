"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const getPaginatedList_1 = __importDefault(require("../../utils/getPaginatedList"));
const getFilterQuery_1 = __importDefault(require("../../utils/getFilterQuery"));
const actions_1 = __importDefault(require("./actions"));
const mongoSchema_2 = __importDefault(require("../user/mongoSchema"));
exports.default = {
    Query: {
        company: (root, args) => mongoSchema_1.default.findById(args.id),
        companies: () => mongoSchema_1.default.find({}),
        companiesList: async (root, { searchFilters, page, limit }) => {
            const filtersQuery = getFilterQuery_1.default(searchFilters);
            return getPaginatedList_1.default(mongoSchema_1.default, { page, limit }, filtersQuery);
        },
    },
    Mutation: {
        addCompany: async (root, { input }, ctx) => actions_1.default.create(input, ctx),
        updateCompany: (root, { id, input }) => actions_1.default.update(id, input),
        updateCompanyStatus: (root, { id, status }) => actions_1.default.updateStatus(id, status),
        removeCompany: (root, { id }) => actions_1.default.remove(id),
    },
    Company: {
        representatives: async (root) => mongoSchema_2.default.find({ _id: { $in: root.representatives } }),
    },
};
