import express from "express";

import {
  CreateUser,
  UpdateUser,
  DeleteUser,
  upload,
  resizeImage,
  getUser,
  deleteProfileImage,
} from "../controllers/user.js";
import { protectRoute } from "../controllers/auth.js";

const route = express.Router();

route.post("/createUser", CreateUser);
route.get("/getUser",protectRoute,getUser);
route.patch("/updateUser",protectRoute,upload.single('photo'), resizeImage, UpdateUser);
route.delete("/deleteUser",protectRoute,DeleteUser);
route.delete('/profileImage',protectRoute,deleteProfileImage);
export default route;
