/*
  require mongoose for model and schema and create the schema
*/
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/*
  For the tweet schema, we first connect it with the other model using ref
  the ref is the same name as the User model.
  we also need content and created date
*/
const TweetSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectI,
    ref: 'User'
  },
  content: String,
  created: {
    type: Date,
    default: Date.now
  }
});

/*
  Export this schema as Tweet mongoose model.
*/
export default mongoose.model('Tweet', TweetSchema);