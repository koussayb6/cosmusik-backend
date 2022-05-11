const router = require("express").Router();
const postController = require("../controllers/classPostController");
const uploadController = require("../controllers/uploadController");
const multer = require("multer");
const upload = multer();

router.get("/", postController.readPost);
router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

// comments
router.patch("/comment-post/:id", postController.commentPost);
router.patch("/edit-comment-post/:id", postController.editCommentPost);
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);

//uploade
//router.post("upload", upload.single("file"), uploadController.uploadPost);

module.exports = router;
