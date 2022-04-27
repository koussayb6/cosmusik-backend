const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    creatorId: {
      type: [String],
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 500,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    participant: {
      type: [String],
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("event", EventSchema);
