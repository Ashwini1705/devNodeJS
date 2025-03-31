const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ["ignored", "intrested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status type is not valid: " + status });
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).send("User not Found!!");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).send("Connection Request is Already Send!!");
    }
    const connectRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectRequest.save();
    res.json({ message: `${req.user.firstName} ${status} the Request!!`, data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

requestRouter.post("/request/view/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status is not valid!!" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "intrested",
    });
    if (!connectionRequest) {
      return res.status(400).json({ message: "No connection request found!!" });
    }
    connectionRequest.status = status;
    await connectionRequest.save();

    res.status(200).json({ message: `${loggedInUser.firstName} has ${status} the status` });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;
