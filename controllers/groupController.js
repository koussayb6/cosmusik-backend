const GroupModel = require("../models/groupModel");
const ObjectID = require("mongoose").Types.ObjectId;
const asyncHandler = require("express-async-handler");
const { populate } = require("../models/groupModel");
const multer = require("multer");

module.exports.readGroup = async (req, res) => {
  GroupModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

module.exports.readOneGroup = async (req, res) => {
  GroupModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  })
    .populate({
      path: "requests",
      populate: { path: "requesterId", model: "User" },
    })
    .sort({ createdAt: -1 });
};

module.exports.creatGroup = async (req, res) => {
  // if (!ObjectID.isValid(req.params.id))
  //return res.status(400).send("ID unknown : " + req.params.id);
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
  const newGroup = new GroupModel({
    title: req.body.title,
    admins: [req.params.id],
    members: [],
    public: true,
    posts: [],
    groupImage: req.file.originalname,
  });

  try {
    const group = await newGroup.save();
    return res.status(201).json(group);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updateGroup = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    public: false,
  };

  GroupModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: false },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

module.exports.deleteGroup = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  GroupModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};

module.exports.addAdminGroup = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return GroupModel.findById(req.params.id, (err, docs) => {
      const isAdmin = docs.admins.includes(req.body.userCnte);
      if (!isAdmin) return res.status(200).send("not authorized");

      GroupModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            admins: req.body.adminToAdd,
          },
        },

        (err, docs) => {
          if (!err) return res.send(docs);
          else return res.status(400).send(err);
        }
      );
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.sendRequest = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    GroupModel.findById(req.params.id, (err, docs) => {
      GroupModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            requests: {
              requesterId: req.user.id,
              description: req.body.description,
              timestamp: new Date().getTime(),
            },
          },
        },
        (err, docs) => {
          if (!err) return res.send("Requested added");
          else return res.status(400).send(err);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.joinGroup = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    GroupModel.findById(req.params.id, (err, docs) => {
      GroupModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            members: req.body.userCnte,
          },
        },

        (err, docs) => {
          if (!err) return res.send("join success");
          else return res.status(400).send(err);
        }
      );
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.readRequests = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  GroupModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs.requests);
    else console.log("Error to get data : " + err);
  })
    .populate("requests")
    .populate("requesterId")
    .sort({ createdAt: -1 });
};

module.exports.confirmRequest = (req, res) => {
  const groupId = req.params.groupId;
  const requesterId = req.params.requestId;
  GroupModel.findByIdAndUpdate(
    groupId,
    {
      $pull: {
        requests: { requesterId: requesterId },
      },

      $push: {
        members: requesterId,
      },
    },
    { safe: true },
    (err, obj) => {
      return res.send("Confirmer");
    }
  );
};

module.exports.refuseRequest = (req, res) => {
  const groupId = req.params.groupId;
  const requesterId = req.params.requestId;
  GroupModel.findByIdAndUpdate(
    groupId,
    {
      $pull: {
        requests: { requesterId: requesterId },
      },
    },
    { safe: true },
    (err, obj) => {
      return res.send("Confirmer");
    }
  );
};

module.exports.searchForGroup = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [{ title: { $regex: req.query.search, $options: "i" } }],
        //     $and: [{ public: { $exists: true } }],
      }
    : {};

  const groups = await await GroupModel.find(keyword);
  res.send(groups);
});
