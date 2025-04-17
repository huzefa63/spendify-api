import { config } from "dotenv";
config({ path: "./.env" });

// module imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// custom imports
import userRoutes from "./routes/user.js";
import expenseRoutes from "./routes/expense.js";
import globalErrorHandler from "./controllers/error.js";

const app = express();
// required middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/expenses", expenseRoutes);

// global error handler
app.use(globalErrorHandler);

export default app;
