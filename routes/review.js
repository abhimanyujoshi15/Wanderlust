const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isRevOwner}  = require("../middleware.js");
const reviewController = require("../controllers/review.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,"Incomplete data sent!");
    }
    else{
        next();
    }
};

//Post route-->
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
//delete review route-->
router.delete("/:reviewId",isLoggedIn,isRevOwner,wrapAsync(reviewController.deleteReview));
module.exports = router;