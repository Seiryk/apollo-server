"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const getPaginatedList_1 = __importDefault(require("../../utils/getPaginatedList"));
const getFilterQuery_1 = __importDefault(require("../../utils/getFilterQuery"));
const actions_1 = __importDefault(require("./actions"));
const mongoSchema_2 = __importDefault(require("../company/mongoSchema"));
exports.default = {
    Query: {
        companyReference: (root, args) => mongoSchema_1.default.findById(args.id),
        companyReferences: () => mongoSchema_1.default.find({}),
        companyReferencesList: async (root, { searchFilters, page, limit }) => {
            const filtersQuery = getFilterQuery_1.default(searchFilters);
            return getPaginatedList_1.default(mongoSchema_1.default, { page, limit }, filtersQuery);
        },
    },
    Mutation: {
        addCompanyReference: (root, { input }) => actions_1.default.create(input),
        updateCompanyReference: (root, { id, input }) => actions_1.default.update(id, input),
        removeCompanyReference: (root, args) => actions_1.default.remove(args.id),
    },
    CompanyReference: {
        company: async (parent) => mongoSchema_2.default.findById(parent.company),
    },
};
