const GroupModel = require("../models/groupModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readGroup = async (req, res) => {
  GroupModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

module.exports.creatGroup = async (req, res) => {
  // if (!ObjectID.isValid(req.params.id))
  //  return res.status(400).send("ID unknown : " + req.params.id);

  const newGroup = new GroupModel({
    title: req.body.title,
    admins: [req.params.id],
    members: [],
    public: true,
    posts: [],
  });

  try {
    const group = await newGroup.save();
    return res.status(201).json(group);
  } catch (err) {
    return res.status(400).send(err);
  }
};
