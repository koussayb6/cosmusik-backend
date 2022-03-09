const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    admins: {
      type: [],
    },
    members: {
      type: [],
    },
    public: {
      type: Boolean,
    },
    posts: {
      type: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("goups", GroupSchema);
