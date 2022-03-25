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
          requesterId: String,
          description: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("goups", GroupSchema);
