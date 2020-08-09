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
const lodash_1 = require("lodash");
const mongoSchema_1 = __importDefault(require("../../entities/profile/mongoSchema"));
const utils_1 = require("./utils");
const index_1 = __importStar(require("../index"));
const defaultFilter = "status eq 'active'";
exports.default = {
    get: index_1.Get(mongoSchema_1.default, {
        filter: defaultFilter,
        aggregate: [
            {
                from: 'Position',
                localField: 'position',
                foreignField: '_id',
                as: 'position',
            },
            {
                from: 'Technology',
                localField: 'expertise',
                foreignField: '_id',
                as: 'expertise',
            },
        ],
    }),
    detail: index_1.Get(mongoSchema_1.default, {
        id: true,
        filter: defaultFilter,
        populate: [
            ['company', 'name'],
            ['position', 'name'],
            ['experience.company', 'name'],
            ['expertise', 'name'],
        ],
    }, 'detail'),
    limited: index_1.Get(mongoSchema_1.default, {
        filter: defaultFilter,
        aggregate: [
            { $unwind: '$experience' },
            {
                $lookup: {
                    from: 'Position',
                    localField: 'position',
                    foreignField: '_id',
                    as: 'position',
                },
            },
            {
                $lookup: {
                    from: 'Technology',
                    localField: 'expertise',
                    foreignField: '_id',
                    as: 'expertise',
                },
            },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'experience.company',
                    foreignField: '_id',
                    as: 'experience.company',
                },
            },
            // { $unwind: '$experience.company' },
            {
                $group: {
                    _id: '$_id',
                    experience: { $push: '$experience' },
                },
            },
        ],
        limited: true,
    }),
    post: index_1.default(async (req) => {
        const { body } = req;
        return index_1.Transaction(async (session) => {
            const result = await utils_1.syncProfileRefs(lodash_1.cloneDeep(body), session);
            const payload = await mongoSchema_1.default.create([result], { session });
            return Promise.resolve(payload[0]);
        });
    }),
    put: index_1.default(async (req) => {
        const { body, params: { id }, } = req;
        return index_1.Transaction(async (session) => {
            const result = await utils_1.syncProfileRefs(lodash_1.cloneDeep(body), session);
            const payload = await mongoSchema_1.default.findOneAndUpdate({ _id: id }, result, { new: true, session });
            return Promise.resolve(payload);
        });
    }),
    status: index_1.default((req) => {
        const { body, params: { id }, } = req;
        return mongoSchema_1.default.findByIdAndUpdate(id, { status: body.status }, { new: true });
    }),
    delete: index_1.default((req) => mongoSchema_1.default.findOneAndRemove({ _id: req.params.id })),
};
