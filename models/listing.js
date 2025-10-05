const mongoose = require("mongoose");
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:String,
    image:{
        filename:String,
        url: String
        // set: (v)=> v=== "" ? "https://unsplash.com/photos/tranquil-lake-reflecting-mountains-and-trees-under-clear-sky-98nNRJRvsIY" :v,
    },
    price:{
        type:Number,
        default:0
    },
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        lat:Number,
        lon:Number
    }
});
//mongoose post middleware-->
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;