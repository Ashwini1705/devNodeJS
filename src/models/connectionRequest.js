const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["intrested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is not valid!",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const connectRequest = this;
  if (connectRequest.fromUserId.equals(connectRequest.toUserId)) {
    throw new Error("Connection Request cannot be send to yourself!!!");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel", connectionRequestSchema);

module.exports = ConnectionRequestModel;
