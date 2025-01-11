

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
}, { timestamps: true });

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.createDummyUser = async function() {
  const dummyUser = {
    email: 'raju@gmail.com',
    password: 'raju123',
    name: 'Raju',
  };

  const existingUser = await this.findOne({ email: dummyUser.email });
  if (existingUser) {
    console.log('Dummy user already exists');
    return existingUser;
  }

  const hashedPassword = await bcrypt.hash(dummyUser.password, 12);
  const newUser = new this({
    ...dummyUser,
    password: hashedPassword,
  });

  await newUser.save();
  console.log('Dummy user created');
  return newUser;
};

const User = mongoose.model('User', userSchema);

module.exports = User;