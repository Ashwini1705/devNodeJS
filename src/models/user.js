const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validationCheck = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 40 },
    lastName: { type: String },
    age: { type: Number, min: 18 },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validationCheck.isEmail(value)) {
          throw new Error("Invalid Email Address!!!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validationCheck.isStrongPassword(value)) {
          throw new Error("Please use strong password!!");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid!!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISuukVSb_iHDfPAaDKboFWXZVloJW9XXiwGYFab-QwlAYQ3zFsx4fToY9ijcVNU5ieKk&usqp=CAU",
      validate(value) {
        if (!validationCheck.isURL(value)) {
          throw new Error("Invalid Photo URL.");
        }
      },
    },
    about: { type: String, default: "This is the default value of the user...!!" },
    skills: { type: [String] },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder123#", { expiresIn: "1d" });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
