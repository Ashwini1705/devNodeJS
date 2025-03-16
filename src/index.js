const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

// Handling middleware for admin route
app.use("/admin", adminAuth);

app.get("/admin/getAllUsers", (req, res) => {
  res.send("All Users Data");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User Data is here");
});

app.post("/user/login", (req, res) => {
  res.send("login page");
});
app.listen(3000, () => {
  console.log("server has started running successfully...");
});
