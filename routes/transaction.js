import express from "express";
import { protectRoute } from "../controllers/auth.js";
import Transaction from '../models/transaction.js';
import { getTransaction } from "../controllers/transaction.js";
const route = express.Router();

route.get("/getTransaction",protectRoute,getTransaction);


route.post("/createExpense", () => {
  console.log("hello");
});
route.put("/updateExpense/:id", () => {
  console.log("hello");
});
route.delete("/deleteExpense/:id", () => {
  console.log("hello");
});

export default route;