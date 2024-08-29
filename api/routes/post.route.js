import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

//Get Posts
router.get("/", getPosts);
//Get A Post
router.get("/:id", getPost);
//Create A New Post
router.post("/", verifyToken, addPost);
//Update A Post
router.put("/:id", verifyToken, updatePost);
//Delete A Post
router.delete("/:id", verifyToken, deletePost);

export default router;
