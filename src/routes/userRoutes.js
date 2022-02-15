const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  createAdminUser,
} = require("../controllers/usercontrollers");
const { auth, superAdminUser } = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/register",
  [
    check("email", "email is requrired ").isEmail(),
    check("fullname", "Please supply the fullname").not().isEmpty(),
    check("password", "Password with minimum of six characters is required")
      .exists()
      .isLength({ min: 6 }),
  ],
  registerUser
);

//Login User route
router.post(
  "/login",
  [
    check("password", "Password with minimum of six characters is required")
      .exists()
      .isLength({ min: 6 }),
    check("email", "email is required").not().isEmpty(),
  ],
  loginUser
);

//get logged in user route
router.get("/", auth, getUser);

//Get any user
router.get("/:id", auth, getUserById);

//Create Admin User
router.post("/admin/:id", auth, superAdminUser, createAdminUser);

//delete User
router.delete("/:id", auth, deleteUser);

module.exports = router;
