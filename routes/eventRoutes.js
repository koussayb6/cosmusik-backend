const router = require("express").Router();
const eventController = require("../controllers/eventController.js");
router.get("/", eventController.readEvent);
router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

//participant
router.put("/:id/participant", eventController.participant);

module.exports = router;
