const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // creating a token
    const token = createToken(user._id);

    res.status(200).json({
      userName: user.userName,
      profileImageUrl: user.profileImage.url,
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { userName, email, password, profileImage } = req.body;

  try {
    const user = await User.signup(userName, email, password, profileImage);

    res.status(201).json({
      status: "success",
      data: { userName, email, user },
      message: "user created successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select({ password: 0, online: 0, __v: 0 });
    
    res.status(201).json({
      status: "success",
      data: { users },
      message: "All users fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getAllUsers,
};
