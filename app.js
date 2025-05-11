import { config } from "dotenv";
config({ path: "./.env" });

// module imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// custom imports
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transaction.js";
import authRoutes from "./routes/auth.js";
import categoriesRoutes from "./routes/categories.js";
import globalErrorHandler from "./controllers/error.js";
import Transaction from './models/transaction.js';
import { faker } from "@faker-js/faker";

const app = express();

// required middlewares
app.use(
  cors({ origin: process.env.URL, credentials: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const categories = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Other",
];
const titles = [
  "Groceries",
  "Bus Ticket",
  "Electric Bill",
  "Movie",
  "Doctor Visit",
  "Random Purchase",
];

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories",categoriesRoutes);
app.use("/", (req, res) => res.send("🟢 Backend is alive! ✅"));





// global error handler
app.use(globalErrorHandler);

export default app;
