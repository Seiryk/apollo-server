"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint no-console: 0 */
const async_1 = require("async");
const fuzzyUtils = {
    // taken from the lib page, used to add fuzzy aggregations to document fields
    update: async (Model, attrs) => {
        const docs = await Model.find();
        const updateToDatabase = async (data, callback) => {
            try {
                if (attrs && attrs.length) {
                    const obj = attrs.reduce((acc, attr) => ({ ...acc, [attr]: data[attr] }), {});
                    return Model.findByIdAndUpdate(data._id, obj).exec();
                }
                return Model.findByIdAndUpdate(data._id, data).exec();
            }
            catch (e) {
                console.log(e);
            }
            finally {
                callback();
            }
        };
        const myQueue = async_1.queue(updateToDatabase, 10);
        async_1.each(docs, (data) => myQueue.push(data.toObject()));
    },
    // taken from the lib page, used to remove unused fuzzy aggregations from document fields
    removeUnused: async (Model, attrs) => {
        const docs = await Model.find();
        const updateToDatabase = async (data, callback) => {
            try {
                const $unset = attrs.reduce((acc, attr) => ({ ...acc, [`${attr}_fuzzy`]: 1 }), {});
                return Model.findByIdAndUpdate(data._id, { $unset }, { new: true, strict: false }).exec();
            }
            catch (e) {
                console.log(e);
            }
            finally {
                callback();
            }
        };
        const myQueue = async_1.queue(updateToDatabase, 10);
        async_1.each(docs, (data) => myQueue.push(data.toObject()));
    },
    createFuzzySearchString: (data) => data.join(' '),
};
exports.default = fuzzyUtils;
