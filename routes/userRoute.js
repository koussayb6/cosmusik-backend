const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAll,
  updateUser,
  deleteUser,
  getOneUser,
  searchForUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getAll);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.get("/:id", protect, getOneUser);
router.get("/search", protect, searchForUser);

module.exports = router;
