const express = require("express");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const authRouter = express.Router();
authRouter.use(cookieParser());

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // check whether the emailID is valid or not;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credientials");
    }
    // validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credientials!!");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    // encrpting the password
    const { firstName, lastName, emailId, password, about, age, gender, photoUrl, skills } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      about,
      age,
      gender,
      photoUrl,
      skills,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token);
    res.json({ message: "User Added Successfully!!", data: savedUser });
  } catch (err) {
    res.status(400).send("Error while saving the user: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully!!");
});

module.exports = authRouter;
