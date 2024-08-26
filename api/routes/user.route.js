import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//Get All Users
router.get("/", getUsers);

//Get A Single User
router.get("/:id", verifyToken, getUser);

//Update User
router.put("/:id", verifyToken, updateUser);

//Delete User
router.delete("/:id", verifyToken, deleteUser);

export default router;
