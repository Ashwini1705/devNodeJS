const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.send("No Token Found!!");
  }
  // Validating the token
  try {
    const { _id } = jwt.verify(token, "Dev@Tinder123#");
    const user = await User.findById(_id);
    if (!user) {
      res.send("No User Found!!");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("Something went wrong!!" + err.message);
  }
};

module.exports = { userAuth };
