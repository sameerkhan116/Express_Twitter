/*
  1. Get monooge and create Schema with mongoose.Schema
  2. Get bcrypt to hash passwords
  3. Get crypto for md5 hashing gravatar
*/
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import validator from 'validator';

const Schema = mongoose.Schema;
/*
  Create user schema as new Schema with email, name and password etc.
*/
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Please provide an email',
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: String,
  photo: String,
  tweets: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
      }
    }
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

/*
  Run this function before user.save
  if password is not modified just forward to next middleware
  if password is just input, create a hash using bcrypt.genSalt.
  if this gives error, return error otherwise continue with hashing.
  set user.password = hash and forward to next middleware.
*/
UserSchema.pre('save', function (next) {
  let user = this;
  if (!user.isModified('password')) 
    return next();
  if (user.password) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) 
        return next(err);
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) 
          return next();
        user.password = hash;
        next(err);
      });
    });
  }
});

/*
  Creating a new gravatar emthods on this schema to get the
  gravatar for the logged in user.
*/
UserSchema.methods.gravatar = function (size) {
  if (!size) 
    size = 200;
  if (!this.email) 
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  var md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
}

/*
  method to compare password using bcrypt which will be
  used when user ties to login
*/
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

export default mongoose.model('User', UserSchema);
