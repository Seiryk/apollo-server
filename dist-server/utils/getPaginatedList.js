"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFuzzySearchedPaginatedList = void 0;
const DEFAULT_LIMIT = 15;
const DEFAULT_TOTAL_PAGES = 1;
const DEFAULT_PAGE = 1;
const getPaginatedList = async (model, args, filters) => {
    const limit = parseInt(args === null || args === void 0 ? void 0 : args.limit, 10) || DEFAULT_LIMIT;
    const totalItems = await model.estimatedDocumentCount(filters);
    const totalPages = Math.ceil(totalItems / limit) || DEFAULT_TOTAL_PAGES;
    const parsedPage = parseInt(args === null || args === void 0 ? void 0 : args.page, 10);
    const page = parsedPage > 0 && parsedPage <= totalPages ? parsedPage : DEFAULT_PAGE;
    const skip = page <= 0 ? 0 : (page - 1) * limit;
    const items = await model.find(filters).skip(skip).limit(limit);
    return {
        items,
        page,
        totalPages,
        totalItems,
        limit,
    };
};
exports.getFuzzySearchedPaginatedList = async (model, search, args, filters) => {
    if (!search)
        return getPaginatedList(model, args, filters);
    const limit = parseInt(args === null || args === void 0 ? void 0 : args.limit, 10) || DEFAULT_LIMIT;
    const fuzzyModel = model;
    const totalItems = await fuzzyModel.fuzzySearch(search, filters).estimatedDocumentCount(filters);
    const totalPages = Math.ceil(totalItems / limit) || DEFAULT_TOTAL_PAGES;
    const parsedPage = parseInt(args === null || args === void 0 ? void 0 : args.page, 10);
    const page = parsedPage > 0 && parsedPage <= totalPages ? parsedPage : DEFAULT_PAGE;
    const skip = page <= 0 ? 0 : (page - 1) * limit;
    const items = await fuzzyModel.fuzzySearch(search, filters).skip(skip).limit(limit);
    return {
        items,
        page,
        totalPages,
        totalItems,
        limit,
    };
};
exports.default = getPaginatedList;
