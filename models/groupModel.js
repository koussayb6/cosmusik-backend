const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    admins: {
      type: [String],
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
    requests: {
      type: [
        {
          requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          description: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
    groupImage: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("goups", GroupSchema);
