const router = require("express").Router();
const groupController = require("../controllers/groupController");

router.get("/", groupController.readGroup);
router.post("/:id", groupController.creatGroup);

module.exports = router;
