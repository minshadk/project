  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");
const validator = require("validator");
const cloudinary = require("../util/cloudinary");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
}); 

// static signup method
userSchema.statics.signup = async function (
  userName,
  email,
  password,
  profileImage
) {
  // validation
  if (!userName || !email || !password || !profileImage) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const userExists = await this.findOne({ email });

  if (userExists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const result = await cloudinary.uploader.upload(profileImage, {
      folder: "profileImage",
      // width: 300,
      // crop: "scale"
    });

    const user = await this.create({
      userName,
      email,
      password: hashedPassword,
      profileImage: { publicId: result.public_id, url: result.secure_url },
    });

    return user;
  } catch (error) {
    return error;
  }
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
