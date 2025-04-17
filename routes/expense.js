import express from "express";

const route = express.Router();

route.post("/createExpense", () => {
  console.log("hello");
});
route.put("/updateExpense", () => {
  console.log("hello");
});
route.delete("/deleteExpense", () => {
  console.log("hello");
});

export default route;
