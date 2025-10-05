const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const validateFunction = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,"Incomplete data sent!");
    }
    else{
        next();
    }
};

//index route-->//create route-->
router.route("/")
.get(wrapAsync(listingController.index))
.post(validateFunction,upload.single("image"),wrapAsync(listingController.postListing));
// new route-->
router.get("/new",isLoggedIn,listingController.newListing);
//edit route-->
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route-->//show route-->//destroy route-->
router.route("/:id")
.patch(isLoggedIn,isOwner,upload.single("image"),wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;