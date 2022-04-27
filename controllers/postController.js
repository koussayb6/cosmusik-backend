const PostModel = require("../models/postModel");
const req = require("express/lib/request");
const res = require("express/lib/response");
const postModel = require("../models/postModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  const posts = await PostModel.find().populate("posterId");
  res.status(200).json(posts);
};
module.exports.createPost = async (req, res) => {
  const newPost = new postModel({
    posterId: req.user.id,
    message: req.body.message,
  });
  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown:" + req.params.id);
  const updateRecord = {
    message: req.body.message,
  };
  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("update error:" + err);
    }
  );
};
module.exports.deletePost = async (req, res) => {
  const postdelete = await PostModel.findById(req.params.id);
  if (!postdelete) return res.status(400).send("ID Unknown:" + req.params.id);
  await postdelete.remove();
  res.status(200).json({ id: req.params.id });
};

module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      if (!theComment) return res.status(404).send("Comment not found");

      theComment.text = req.body.text;

      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
//like and dislike in the same funtion

module.exports.likedislike = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post.likers.includes(req.user.id)) {
      await post.updateOne({ $push: { likers: req.user.id } });
      res.status(200).send(true);
    } else {
      await post.updateOne({ $pull: { likers: req.user.id } });
      res.status(200).send(false);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports.sharedBy = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post.sharedBy.includes(req.user.id)) {
      await post.updateOne({ $push: { sharedBy: req.user.id } });
      res.status(200).json("The post has been Shared");
    } else {
      await post.updateOne({ $pull: { sharedBy: req.user.id } });
      res.status(200).json("The post has been removed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
