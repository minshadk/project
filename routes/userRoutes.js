const express = require("express");

// controller functions
const { signupUser, loginUser ,getAllUsers} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/getAllUsers", getAllUsers);

module.exports = router;
