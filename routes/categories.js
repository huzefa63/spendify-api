import express from "express";

import { handleCreateCategory, handleDeleteCategory,handleGetCategories } from "../controllers/categories.js";
import { protectRoute } from "../controllers/auth.js";
const route = express.Router();

route.get("/getCategories",protectRoute,handleGetCategories);
route.post("/createCategory",protectRoute, handleCreateCategory);
route.delete("/deleteCategory",protectRoute, handleDeleteCategory);

export default route;