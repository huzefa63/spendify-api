import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: [validator.isEmail, "valid email is required"],
    unique: true,
  },
  profileImage: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const model = mongoose.model("User", schema);
export default model;
