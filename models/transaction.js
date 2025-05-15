import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    // default: new Date(),
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
  transactionType:{
    type: String,
    required: [true, "user id is required"],
  },
  note: {
    type:String,
    default:'',
  },
  year:String,
  month:String,
  monthNumber:Number
},{timestamps:true});

schema.pre('save',function(next){
  const month = ['jan','feb','march','april','may','june','july','aug','sep','oct','nov','dec'];
  this.year = this.date.getFullYear()
  this.month = month[this.date.getMonth()];
  this.monthNumber = month.indexOf(this.month);
  next();
})

schema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.date) {
    const date = new Date(update.date); // ensure it's a Date object
    const months = ['jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    update.year = date.getFullYear().toString();
    update.month = months[date.getMonth()];
    update.monthNumber = date.getMonth() + 1; // 1-based (Jan = 1)

    // Reassign the updated fields
    this.setUpdate(update);
  }

  next();
});


const model = mongoose.model('Transaction',schema);
export default model;