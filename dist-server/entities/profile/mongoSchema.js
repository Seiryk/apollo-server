"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_fuzzy_searching_1 = __importDefault(require("mongoose-fuzzy-searching"));
const date_fns_1 = require("date-fns");
const fuzzyUtils_1 = __importDefault(require("../../vendors/mongoose-fuzzy-searching/fuzzyUtils"));
const { Schema } = mongoose_1.default;
const experienceSchema = new mongoose_1.default.Schema({
    position: String,
    company: { type: Schema.Types.ObjectId, ref: 'CompanyReference' },
    workType: String,
    startDate: Date,
    endDate: Date,
    city: String,
    country: String,
    months: Number,
});
experienceSchema.pre('save', function () {
    this.months = date_fns_1.differenceInCalendarMonths(this.endDate, this.startDate);
});
const educationSchema = new mongoose_1.default.Schema({
    course: String,
    degree: String,
    startDate: Date,
    endDate: Date,
    city: String,
    country: String,
});
const profileSchema = new mongoose_1.default.Schema({
    name: String,
    surname: String,
    workType: String,
    position: { type: Schema.Types.ObjectId, ref: 'Position' },
    summary: String,
    city: String,
    country: String,
    salaryMin: Number,
    salaryMax: Number,
    status: String,
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
    expertise: [{ type: Schema.Types.ObjectId, ref: 'Technology' }],
    education: [educationSchema],
    experience: [experienceSchema],
    totalMonths: Number,
    email: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
});
profileSchema.plugin(mongoose_fuzzy_searching_1.default, {
    fields: ['city'],
});
profileSchema.pre('save', function () {
    if (!this.status) {
        this.status = 'active';
    }
    this.totalMonths = this.experience.reduce((acc, item) => acc + item.months, 0);
});
const ProfileModel = mongoose_1.default.model('Profile', profileSchema, 'Profile');
// use to create fuzzy indexing for existing data, should be commented out otherwise
const updateFuzzyIndexes = async () => {
    await ProfileModel.syncIndexes();
    await fuzzyUtils_1.default.update(ProfileModel, ['city']);
};
// TODO: comment this out after updating the existing database on servers
(async () => updateFuzzyIndexes())();
exports.default = ProfileModel;
