import mongoose from "mongoose";
import app from "./app.js";
(async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (err) {
    console.log("connection failed");
    console.log(err.name);
  }
})();


app.listen(process.env.PORT, (req, res) => {
  console.log("listening");
});
