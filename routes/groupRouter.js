const router = require("express").Router();
const groupController = require("../controllers/groupController");

router.get("/", groupController.readGroup);
router.post("/:id", groupController.creatGroup);
router.post("/sendReq/:id", groupController.sendRequest);
router.put("/:id", groupController.updateGroup);
router.delete("/:id", groupController.deleteGroup);
router.patch("/addAdmin/:id", groupController.addAdminGroup);
router.patch("/joinGroup/:id", groupController.joinGroup);
router.get("/oneGroup/:id", groupController.readOneGroup);

router.get("/requests/:id", groupController.readRequests);
router.patch(
  "/confirmRequest/:requestId/:groupId",
  groupController.confirmRequest
);
router.get("/search", groupController.searchForGroup);

module.exports = router;
