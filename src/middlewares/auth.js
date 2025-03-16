const adminAuth = (req, res, next) => {
  const token = "abcdefg";
  console.log("in admin middleware");
  const isAuthorized = token === "abcdefg";
  if (!isAuthorized) {
    res.status(401).send("Admin UnAuthorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("checking the userAuth");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("unAuthorized user");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
