"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncProfileRefs = exports.CompanyRefSyncResult = void 0;
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const joiObjectId_1 = require("../../utils/joiObjectId");
const mongoSchema_1 = __importDefault(require("../../entities/position/mongoSchema"));
const mongoSchema_2 = __importDefault(require("../../entities/technology/mongoSchema"));
const mongoSchema_3 = __importDefault(require("../../entities/company/mongoSchema"));
const mongoSchema_4 = __importDefault(require("../../entities/companyReference/mongoSchema"));
exports.CompanyRefSyncResult = ({ _id, name }, create, data) => {
    const [key] = Object.entries(create).find(([, value]) => value === name);
    if (key) {
        data.experience[key].company = _id;
        delete create[key];
    }
};
exports.syncProfileRefs = async (data, session) => {
    const { position, company } = data;
    let positions = [position];
    positions = lodash_1.uniq(positions.concat(data.experience.map(({ position }) => position)));
    positions = positions.filter((item) => !joiObjectId_1.isObjectId(item));
    if (positions.length) {
        const result = await mongoSchema_1.default.find({ name: { $in: positions } }).session(session);
        if (result.length) {
            result.forEach(({ _id, name }) => {
                if (name === position) {
                    data.position = _id;
                }
                const index = data.experience.findIndex(({ position }) => position === name);
                if (index > -1) {
                    data.experience[index].position = _id;
                }
                positions = positions.filter((item) => item !== name);
                return false;
            });
        }
        if (positions.length) {
            const result = await mongoSchema_1.default.create(positions.map((name) => ({ name })), { session });
            if (result.length) {
                result.forEach(({ _id, name }) => {
                    if (position === name) {
                        data.position = _id;
                    }
                    const index = data.experience.findIndex(({ position }) => position === name);
                    if (index > -1) {
                        data.experience[index].position = _id;
                    }
                    return false;
                });
            }
        }
    }
    if (!joiObjectId_1.isObjectId(company)) {
        const result = await mongoSchema_3.default.findOne({ name: company }).session(session);
        if (!result) {
            const result = await mongoSchema_3.default.create([{ name: company }], { session });
            data.company = result[0]._id;
        }
        else {
            data.company = result._id;
        }
    }
    if (data.expertise && data.expertise.some((item) => !mongoose_1.isValidObjectId(item))) {
        data.expertise = data.expertise.reduce((acc, name) => {
            acc[joiObjectId_1.isObjectId(name) ? 'old' : 'new'].push(name);
            return acc;
        }, { old: [], new: [] });
        if (data.expertise.new.length) {
            const result = await mongoSchema_2.default.find({ name: { $in: data.expertise.new } }).session(session);
            if (result.length) {
                result.forEach(({ _id, name }) => {
                    data.expertise.new = data.expertise.new.filter((item) => item !== name);
                    data.expertise.old.push(_id);
                });
            }
            if (data.expertise.new.length) {
                const result = await mongoSchema_2.default.create(data.expertise.new.map((name) => ({ name })), { session });
                if (result.length) {
                    data.expertise.old = data.expertise.old.concat(result.map(({ _id }) => _id));
                }
            }
        }
    }
    if (data.experience && data.experience.some(({ company }) => !mongoose_1.isValidObjectId(company))) {
        const create = data.experience.reduce((acc, { company }, index) => {
            if (!joiObjectId_1.isObjectId(company)) {
                acc[index] = company;
                return acc;
            }
            return acc;
        }, {});
        if (!lodash_1.isEmpty(create)) {
            const values = Object.values(create);
            const result = await mongoSchema_4.default.find({ name: { $in: values } }).session(session);
            result.forEach((item) => {
                exports.CompanyRefSyncResult(item, create, data);
            });
            if (!lodash_1.isEmpty(create)) {
                const result = await mongoSchema_4.default.create(Object.values(create).map((name) => ({ name })), { session });
                result.forEach((item) => {
                    exports.CompanyRefSyncResult(item, create, data);
                });
            }
        }
    }
    if (data.expertise && data.expertise.old) {
        data.expertise = data.expertise.old;
    }
    return lodash_1.pick(data, [
        'name',
        'surname',
        'company',
        'position',
        'workType',
        'email',
        'expertise',
        'education',
        'experience',
        'salaryMin',
        'salaryMax',
        'city',
        'country',
    ]);
};
