const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose); //automatically adds username,salting,passwords into schema.

const User = mongoose.model("User",userSchema);
module.exports = User;