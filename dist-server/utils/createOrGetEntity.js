"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createOrGetEntity = async (newDataObject, entityActions, model, searchField = 'name') => {
    var _a;
    try {
        const newEntity = await entityActions.create(newDataObject);
        return newEntity;
    }
    catch (e) {
        const error = e;
        if ((_a = error === null || error === void 0 ? void 0 : error.errors) === null || _a === void 0 ? void 0 : _a[searchField].message.includes('already exists')) {
            return model.findOne().where(searchField).equals(newDataObject[searchField]).exec();
        }
        throw e;
    }
};
exports.default = createOrGetEntity;
