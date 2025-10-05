const Review = require("../models/review");
const Listing = require("../models/listing.js");

module.exports.postReview = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating,comment} = req.body;
    let newRev = new Review({
        rating: rating,
        comment:comment
    });
    newRev.owner  = req.user._id;
    listing.reviews.push(newRev._id);

    await newRev.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); // pull  operator removes specific review from array based on reviewid.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};