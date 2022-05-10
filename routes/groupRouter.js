const router = require("express").Router();
const multer = require("multer");

const groupController = require("../controllers/groupController");
const { protect } = require("../middleware/authMiddleware");

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

router.get("/", groupController.readGroup);
router.post("/:id", upload.single("groupImage"), groupController.creatGroup);
router.post("/sendReq/:id", protect, groupController.sendRequest);
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
router.patch(
  "/refuseRequest/:requestId/:groupId",
  groupController.refuseRequest
);
router.get("/search", groupController.searchForGroup);

module.exports = router;
