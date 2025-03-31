const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { validateEditProfileData } = require("../utils/validations");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

// get Profile
profileRouter.get("/profile/view", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const { _id } = await jwt.verify(token, "Dev@Tinder123#");
      const user = await User.findById(_id);
      res.send(user);
    } else {
      res.status(401).send("Please Login!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});

// EDIT PROFILE
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Edit fields are not valid");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    // res.send("Profile was updated Successfully!");
    res.json({ message: `${loggedInUser.firstName}, your profile updated successfully`, data: loggedInUser });
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

// Update User
profileRouter.patch("/user/:id", async (req, res) => {
  const userId = req.params?.id;
  // const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isAllowedUpdates = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    if (!isAllowedUpdates) {
      throw new Error("Update is not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true });
    res.send("User updated Successfully!!");
  } catch (err) {
    res.status(400).send("Invalid Entry " + err.message);
  }
});

module.exports = profileRouter;
