"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoSchema_1 = __importDefault(require("./mongoSchema"));
const getPaginatedList_1 = __importDefault(require("../../utils/getPaginatedList"));
const getFilterQuery_1 = __importDefault(require("../../utils/getFilterQuery"));
const actions_1 = __importDefault(require("./actions"));
exports.default = {
    Query: {
        technology: (root, args) => mongoSchema_1.default.findById(args.id),
        technologies: (root, args) => mongoSchema_1.default.find({}),
        technologiesList: async (root, { searchFilters, page, limit }) => {
            const filtersQuery = getFilterQuery_1.default(searchFilters);
            const response = await getPaginatedList_1.default(mongoSchema_1.default, { page, limit }, filtersQuery);
            return response;
        },
    },
    Mutation: {
        addTechnology: (root, { input }) => actions_1.default.create(input),
        updateTechnology: (root, { id, input }) => actions_1.default.update(id, input),
        removeTechnology: (root, { id }) => actions_1.default.removeTechnology(id),
    },
};
