import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique:true
  },
});

const model = mongoose.model('Categories',schema);
export default model;