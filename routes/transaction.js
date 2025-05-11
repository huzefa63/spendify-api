import express from "express";
import { protectRoute } from "../controllers/auth.js";
import Transaction from '../models/transaction.js';
import { getTransaction,createTransaction,deleteTransaction,updateTransaction } from "../controllers/transaction.js";
const route = express.Router();

route.get("/getTransaction",protectRoute,getTransaction);


route.post("/createTransaction",protectRoute,createTransaction);
route.put("/updateTransaction/:id",protectRoute,updateTransaction);
route.delete("/deleteTransaction/:id",protectRoute,deleteTransaction);

export default route;