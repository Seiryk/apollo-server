"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Get = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const lodash_1 = require("lodash");
const resolve_query_1 = __importDefault(require("../utils/resolve-query"));
function Controller(Controller, type) {
    return async (req, res, next) => {
        try {
            const result = await Controller(req, res, next);
            const payload = lodash_1.get(result, 'payload', result);
            let data = {};
            if (result && result.payload) {
                data = result;
            }
            else {
                data.payload = result;
            }
            data = lodash_1.pickBy(data, lodash_1.identity);
            if (type === 'detail' && lodash_1.isEmpty(payload)) {
                return res.status(404).json({ status: 404, ...data }).end();
            }
            return res.status(200).json({ status: 200, ...data }).end();
        }
        catch (e) {
            const message = lodash_1.get(e, 'message');
            return res.status(400).json({ status: 400, errors: e, message }).end();
        }
    };
}
exports.Get = (Model, options = {}, type = 'get') => Controller(async (req) => {
    const { id, filter, aggregate, limited, } = options;
    // @ts-ignore
    const result = Model.aggregate(aggregate);
    if (id)
        result.match({ _id: new mongoose_1.default.Types.ObjectId(id) });
    if (filter && !req.query.$filter) {
        req.query.$filter = filter;
    }
    if (!id && !lodash_1.isEmpty(req.query)) {
        const { count, payload } = await resolve_query_1.default(Model, result, req.query, { limited });
        return {
            query: req.query,
            count,
            payload,
        };
    }
    return result;
}, type);
exports.Transaction = async (Handler) => {
    const session = await mongoose_1.startSession();
    session.startTransaction();
    try {
        const result = await Handler(session);
        await session.commitTransaction();
        session.endSession();
        return Promise.resolve(result);
    }
    catch (e) {
        await session.abortTransaction();
        session.endSession();
        return Promise.reject(e);
    }
};
exports.default = Controller;
