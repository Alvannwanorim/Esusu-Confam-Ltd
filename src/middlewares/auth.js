const jwt = require("jsonwebtoken");
const User = require("../models/userModels");


exports.auth = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");

  //check if token exists
  if (!token) {

    return res.status(400).json({
      statusCode: 400,
      message: "Anthentication denied, token not found",
    });
  }
  try {
    //verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    //return error if token is not valid
    if (!decoded) {
      return res.status(400).json({
        statusCode: 400,
        message: "Anthentication failed, User not authorized",
      });
    }
    //assign token to request body
    req.user = decoded.user;


    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Authentication Failed, Experied Token",
    });
  }
};

exports.adminUser = async (req, res, next) => {
  if (req.user) {

    const adminUser = await User.findById(req.user.id.toString())
    if (adminUser.isAdmin)
      next();
  } else {
    res.status(401);
    throw new Error("User not Authorized");
  }
};

exports.superAdminUser = async (req, res, next) => {
  if (req.user) {
    const superAdmin = await User.findById(req.user.id)
    if (superAdmin.isSuperAdmin)
      next();
  } else {
    res.status(401);
    throw new Error("User not Authorized");
  }
};
