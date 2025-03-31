const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const cors = require("cors");
const { validateSignUpData } = require("./utils/validations");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

// MIDDLEWARE: reads the JSON obj converts to JS obj
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// get the users based on emailID
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("No User Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

// get all Users
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.cookie("token", "dsfjsldfhskdgjhksdhfksdfjsdlkjf");
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete Users
app.delete("/user", async (req, res) => {
  const userEmail = req.body.userId;
  try {
    // await User.findOneAndDelete({ emailId: userEmail });
    await User.findByIdAndDelete(userEmail);
    res.send("User Deleted SuccessFully!!");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established successfully...");
    app.listen(3000, () => {
      console.log("server has started running successfully...");
    });
  })
  .catch((err) => {
    console.error("connection could not able to connect");
  });
