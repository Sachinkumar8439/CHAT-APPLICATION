const mongoose = require("mongoose");

const UserinfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  address:{
    registartion_adress:{
        type:String,
    },
},
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userinfo", UserinfoSchema);
