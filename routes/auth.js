import express from "express";

import { handleLoginUser, handleLogoutUser, protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post("/login", handleLoginUser);
route.post("/logout", handleLogoutUser);

export default route;