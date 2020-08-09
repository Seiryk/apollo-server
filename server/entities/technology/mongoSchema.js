import mongoose from 'mongoose';

const technologySchema = new mongoose.Schema({
  name: String,
}, {
  timestamps: true,
});

const Technology = mongoose.model('Technology', technologySchema, 'Technology');

export default Technology;
