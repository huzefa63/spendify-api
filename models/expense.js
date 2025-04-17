import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  amount: {
    type: Number,
    required: [true, "amount is required"],
  },
  title: {
    type: String,
    required: [true, "title is required"],
  },
  category: {
    type: String,
    required: [true, "category is required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user id is required"],
  },
  note: {
    type:String,
    default:'',
  },
});

const model = mongoose.model('Expense',schema);
export default model;