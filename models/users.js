const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/index.config');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  
  firstName: { 
  	type: String, 
  },

  lastName: {
  	type: String
  },

  username: {
    type: String,
    unique: true, // Make username field unique
    index: true,
    required: [true, 'please provide a username']
  },

  password: {
  	type: String,
    required: [true, 'please provide a password']
  },

  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: ['admin']
  },

  _schoolId:{
    type: mongoose.Types.ObjectId,
    ref: 'School', 
    required: true,
},
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(parseInt(config.dotEnv.BCRYPT_SALT));
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

module.exports = mongoose.model('User', UserSchema);