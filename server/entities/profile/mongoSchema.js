import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  position: String,
  company: mongoose.Schema.Types.ObjectId,
  workType: String,
  startDate: Number,
  endDate: Number,
  country: String,
  city: String,
});

const educationSchema = new mongoose.Schema({
  course: String,
  degree: String,
  startDate: Number,
  endDate: Number,
  country: String,
  city: String,
});


const profileSchema = new mongoose.Schema({
  name: String,
  surname: String,
  country: String,
  workType: String,
  position: String,
  summary: String,
  city: String,
  salaryMin: Number,
  salaryMax: Number,
  company: mongoose.Schema.Types.ObjectId,
  expertise: [mongoose.Schema.Types.ObjectId],
  education: [educationSchema],
  experience: [experienceSchema],
  email: {
    type: String,
    validate: {
      validator: (email) => !isExist({ email }),
      message: () => 'Duplicate email',
    },
  },
}, {
  timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema, 'Profile');

async function isExist({ email }) {
  const count = await Profile.countDocuments({ email });
  return !!count;
}

export default Profile;
