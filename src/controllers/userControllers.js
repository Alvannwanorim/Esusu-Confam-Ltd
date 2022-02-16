const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModels");
const { validationResult } = require("express-validator");

//@desc REGISTER USER
//@route POST: /api/users/auth/register
//access Public

exports.registerUser = async (req, res) => {
  const { fullname, location, email, password } = req.body;
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      message: result.array(),
    });
  }
  try {
    //check for existing user: email
    const existingUser = await User.findOne({ email });

    //return error if user already exists
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    //create new user recors
    const newUser = new User({
      fullname,
      location,
      email,
      isAdmin: false,
      isSuperAdmin: false,
      password: hashedPassword,
    });

    await newUser.save();


    //return user information to client 
    res.status(201).json({
      statusCode: 201,
      user: {
        fullname: newUser.fullname,
        email: newUser.email,
        location: newUser.location
      },
    });
  } catch (err) {
    //log and return error when request fails 
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc LOGIN USER
//@route POST: /api/users/auth/login
//access Public

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    //check if user exists
    const user = await User.findOne({ email });

    //if user does not exist return error message to client 
    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "User does not exist",
      });
    }
    //check for password validity
    const isMatch = await bcrypt.compare(password, user.password);

    //return error message for password miss-match
    if (!isMatch) {
      return res.status(400).json({
        statusCode: 400,
        message: "password is incorrect",
      });
    }

    // jwt payload 
    const payload = {
      user: {
        name: user.fullname,
        id: user._id,
      },
    };

    const token = await jwt.sign(payload, process.env.TOKEN_KEY, {
      expiresIn: "1d",
    });

    //return signin token to client
    res.status(200).json({
      statusCode: 200,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc GET USER BY ID
//@route  GET: /api/users/auth/
//access Private

exports.getUser = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await User.findById(id).select("-password").select("-isAdmin").select("-isSuperAdmin")

    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "User not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc GET USER BY ID
//@route /api/users/auth/:id
//access Private

exports.getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};


//@desc CREATE ADMIN
//@route /api/users/auth/:adminId
//access Private

exports.createAdminUser = async (req, res) => {
  const userid = req.params.id;
  try {
    const user = await User.findById(userid).select("-password").select("-isSuperAdmin")
    if (!user) {
      return res.status(201).json({
        statusCode: 201,
        message: "User not found"
      });
    }

    if (user.isAdmin) {
      return res.status(201).json({
        statusCode: 201,
        message: "User is already an admin"
      });
    }
    user.isAdmin = true

    await user.save()
    res.status(200).json({
      statusCode: 200,
      user: user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

//@desc DELETE USER
//@route /api/users/auth/:userId
//access Private
exports.deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    if (userId.toString() !== req.params.id) {
      return res.status(403).json({
        statusCode: 403,
        message: "User not authorized",
      });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (userId !== user._id.toString()) {
      return res.status(403).json({
        statusCode: 403,
        message: "User not authorized",
      });
    }

    await user.remove();
    res.status(200).json({
      statusCode: 200,
      message: "User remove sucessfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};
