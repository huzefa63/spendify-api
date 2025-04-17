import express from "express";

import { createUser } from "../controllers/user.js";

const route = express.Router();

route.post("/createUser", createUser);

route.put("/updateUser", () => {
  console.log("hello");
});

route.delete("/deleteUser", () => {
  console.log("hello");
});

export default route;
