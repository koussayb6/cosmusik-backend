const event = require("../models/eventModel");
const ObjectID = require("mongoose").Types.ObjectId;
//get all events
module.exports.readEvent = (req, res) => {
  event.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};
module.exports.createEvent = async (req, res) => {
  const newEvent = new event({
    creatorId: req.body.creatorId,
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    participant: [],
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });
  try {
    const event = await newEvent.save();
    return res.status(201).json(event);
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.updateEvent = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Event ID Unknown:" + req.params.id);
  const updateRecord = {
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };
  event.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("update error:" + err);
    }
  );
};
module.exports.deleteEvent = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Event ID Unknown:" + req.params.id);
  await event.remove();
  res.status(200).json({ id: req.params.id });
};

module.exports.participant = async (req, res) => {
  try {
    const event = await event.findById(req.params.id);
    if (!event.participant.includes(req.body.goalId)) {
      await event.updateOne({ $push: { participant: req.body.goalId } });
      res.status(200).json("You Have Been Added To The Event");
    } else {
      await event.updateOne({ $pull: { participant: req.body.goalId } });
      res.status(200).json("You Have Been removed from the Event");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
