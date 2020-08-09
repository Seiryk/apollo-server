import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  surname: String,
  name: String,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
