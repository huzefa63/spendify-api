import express from "express";

import { CreateUser, UpdateUser, DeleteUser, upload, resizeImage, getUser } from "../controllers/user.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post("/createUser", CreateUser);
route.get("/getUser",protectRoute,getUser);
route.put("/updateUser",protectRoute,upload.single('photo'), resizeImage, UpdateUser);
route.delete("/deleteUser",protectRoute,DeleteUser);

export default route;
