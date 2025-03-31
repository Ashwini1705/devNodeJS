const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Invalid Name!!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid EmailID!!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password!!");
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = ["firstName", "lastName", "emailId", "age", "about", "skills", "gender", "photoUrl"];

  const isAllowedFieldsValid = Object.keys(req.body).every((field) => allowedFields.includes(field));
  return isAllowedFieldsValid;
};

module.exports = { validateSignUpData, validateEditProfileData };
