import express from "express";

import { handleLoginUser, handleLogoutUser, protectRoute,verifyToken } from "../controllers/auth.js";

const route = express.Router();

route.post("/login", handleLoginUser);
route.post("/logout", handleLogoutUser);
route.get('/verify-token',verifyToken);
export default route;