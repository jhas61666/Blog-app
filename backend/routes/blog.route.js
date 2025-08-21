import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import { createBlog, deleteBlog, dislikeBlog, getMyTotalBlogLikes, getOwnBlog, getPublishedBlog, likeBlog, togglePublishedBlog, updateBlog } from "../controllers/blog.controller.js";


const router = express.Router()

router.route("/").post(isAuthenticated, createBlog)
router.route("/:blogId").put(isAuthenticated, singleUpload, updateBlog)
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlog);
router.route("/delete/:id").delete(isAuthenticated, deleteBlog);
router.route("/:id/like").get(isAuthenticated, likeBlog);
router.route("/:id/dislike").get(isAuthenticated, dislikeBlog);
router.route("/my-blogs/likes").get(isAuthenticated, getMyTotalBlogLikes);
router.route("/get-published-blogs").get(getPublishedBlog)
router.route("/:blogId").patch(togglePublishedBlog);

export default router