const GroupModel = require("../models/groupModel");
const ObjectID = require("mongoose").Types.ObjectId;
const asyncHandler = require("express-async-handler");

module.exports.readGroup = async (req, res) => {
  GroupModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

module.exports.creatGroup = async (req, res) => {
  // if (!ObjectID.isValid(req.params.id))
  //return res.status(400).send("ID unknown : " + req.params.id);

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

module.exports.updateGroup = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    title: req.body.title,
    public: req.body.public,
  };

  GroupModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
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

module.exports.joinGroup = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    GroupModel.findById(req.params.id, (err, docs) => {
      if (!docs.public) {
        GroupModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              requests: {
                requesterId: req.body.userCnte,
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
      } else {
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
      }
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
  }).sort({ createdAt: -1 });
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

  /** GroupModel.findById(groupId)
    .then((group) => {
      if (!group) {
        return res.send(" Group not found");
      } else {
       // const aa = group.requests.findById(requestId);
        //const id = aa.requesterId;
        group.requests.pull(requesterId:requestId);
        group.save();
        group.push({ members: id });
        
      
        return res.send("confirmer");
      }
    })
    .catch((err) => {
      console.log(err);
    }); */
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
