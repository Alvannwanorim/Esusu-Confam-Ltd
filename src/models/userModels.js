const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      min: 3,
      max: 23,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
    },
    location:{
      type: String,
    },
    isAdmin: {
      type: Boolean,
      defualt: false,
    },
    isSuperAdmin: {
      type: Boolean,
      defualt: false,
    },
    totalContributions:{
      type: Number,
      default:0
    },
    TotalWithdrawal:{
      type: Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
