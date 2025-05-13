import mongoose from "mongoose";
import validator from "validator";
import { hash,compare } from "bcryptjs";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: [validator.isEmail, "valid email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  changedPasswordAt:Date,
  profileImage: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  role:{
    type:String,
    default:'user',
    enum:['user','admin'],
  },
  isActive:{
    type:Boolean,
    default:true,
    select:false,
  }
});

schema.pre('save',async function(next){
  console.log('pre middleware');
  if(!this.isModified('password')) return next();
  console.log('after pre');
  const hashedPass = await hash(this.password,10);
  this.password = hashedPass;
  this.passwordConfirm = undefined;
  next();
})

schema.methods.checkPassword = async function(candidatePass,currentPass) {
  return await compare(candidatePass,currentPass);
}

const model = mongoose.model("User", schema);
export default model;
