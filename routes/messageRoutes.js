const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(
      null,
      "C:/Users/ahmed/Desktop/react/cosmusik-frontend/public/uploads"
    );
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, upload.single("imageMessage"), sendMessage);

module.exports = router;
