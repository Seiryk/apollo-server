import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: String,
  employees: [mongoose.Schema.Types.ObjectId],
}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema, 'Company');

export default Company;
