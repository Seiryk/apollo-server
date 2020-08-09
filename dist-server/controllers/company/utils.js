"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySyncRepresentatives = void 0;
const mongoSchema_1 = __importDefault(require("../../entities/role/mongoSchema"));
const mongoSchema_2 = __importDefault(require("../../entities/user/mongoSchema"));
const joiObjectId_1 = require("../../utils/joiObjectId");
exports.CompanySyncRepresentatives = async (id, data, session) => {
    let roles = await mongoSchema_1.default.find();
    roles = roles.reduce((acc, { _id, name }) => {
        acc[name] = _id;
        return acc;
    }, {});
    const { representatives } = data;
    await mongoSchema_2.default.updateMany({ company: id, role: roles.Represetative }, { company: undefined, role: undefined }, { new: true, session });
    if (representatives.some((item) => !joiObjectId_1.isObjectId(item))) {
        // eslint-disable-next-line
        let { ids, emails } = representatives.reduce((acc, item) => {
            acc[joiObjectId_1.isObjectId(item) ? 'ids' : 'emails'].push(item);
            return acc;
        }, { ids: [], emails: [] });
        if (emails.length) {
            const result = await mongoSchema_2.default.find({ email: { $in: emails } }).session(session);
            if (result.length) {
                const update = [];
                // eslint-disable-next-line
                result.forEach(({ _id, email, company, role }) => {
                    if (!role || company.toHexString() === id) {
                        emails = emails.filter((item) => item !== email);
                        ids.push(_id);
                        update.push(_id);
                    }
                    else {
                        emails = emails.filter((item) => item._id.toHexString() !== id.toHexString());
                    }
                });
                if (update.length) {
                    await mongoSchema_2.default.updateMany({ _id: { $in: update } }, { role: roles.Represetative, company: id }).session(session);
                }
            }
            if (emails.length) {
                const { _id } = await mongoSchema_1.default.findOne({ value: { $eq: 1 } });
                const result = await mongoSchema_2.default.create(emails.map((email) => ({ email, company: id, role: _id })), { session });
                ids = ids.concat(result.map(({ _id }) => _id));
            }
            data.representatives = ids;
        }
    }
    return data;
};
