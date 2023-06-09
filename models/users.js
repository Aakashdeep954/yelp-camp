const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
      email: {
            type: String,
            require: true,
            unique: true,
      },
});

userSchema.plugin(passportLocalMongoose);
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
