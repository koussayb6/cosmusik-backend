const router = require("express").Router();
const postController = require("../controllers/postController.js");
const { protect } = require("../middleware/authMiddleware.js");
router.get("/", protect, postController.readPost);
router.post("/", protect, postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

// comments
router.patch("/comment-post/:id", protect, postController.commentPost);
router.patch("/edit-comment-post/:id", protect, postController.editCommentPost);
router.patch(
  "/delete-comment-post/:id",
  protect,
  postController.deleteCommentPost
);
router.get("/:id/like", protect, postController.likedislike);

//SharePost
router.put("/:id/share", protect, postController.sharedBy);

module.exports = router;
