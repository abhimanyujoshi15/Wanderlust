const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;