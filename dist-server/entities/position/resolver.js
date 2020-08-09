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
        position: (root, args) => mongoSchema_1.default.findById(args.id),
        positions: () => mongoSchema_1.default.find({}),
        positionsList: async (root, { searchFilters, page, limit }) => {
            const filtersQuery = getFilterQuery_1.default(searchFilters);
            return getPaginatedList_1.default(mongoSchema_1.default, { page, limit }, filtersQuery);
        },
    },
    Mutation: {
        addPosition: (root, { input }) => actions_1.default.create(input),
        updatePosition: (root, { id, input }) => actions_1.default.update(id, input),
        removePosition: (root, { id }) => actions_1.default.remove(id),
    },
};
