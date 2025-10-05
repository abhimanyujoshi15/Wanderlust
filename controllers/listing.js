const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({})
    res.render("../views/listings/index.ejs",{allListing});
};
module.exports.newListing = (req,res)=>{
    res.render("listings/form.ejs");
};
module.exports.postListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let {title,description,price,location,country} = req.body;
    let coordinates = null;
    try {
        const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: `${location}, ${country}`,
                format: "json",
                limit: 1
            },
            headers: { "User-Agent": "wanderlust-app" } // required by Nominatim
        });

        if (geoResponse.data.length > 0) {
            coordinates = {
                lat: parseFloat(geoResponse.data[0].lat),
                lon: parseFloat(geoResponse.data[0].lon)
            };
        }
    } catch (err) {
        console.log("Geocoding error:", err);
    }
    let listing = new Listing({
        title:title,
        description:description,
        image:{
            url:url,
            filename:filename
        },
        price:price,
        location:location,
        country:country,
        geometry:coordinates
    });
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success","New Lisiting Created!");
    res.redirect("/listings");
};
module.exports.updateListing = async (req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    let{title,description,price,location,country} = req.body;
    await Listing.findByIdAndUpdate(id,{
        title:title,
        description:description,
        price:price,
        location:location,
        country:country
    });
    if(typeof req.file!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image.url = url,
        listing.image.filename = filename
        await listing.save();
    }
    req.flash("success","Lisiting Updated!");
    res.redirect("/listings");
    };
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id); //when deleted mongoose post middleware also works.
    req.flash("success","Lisiting Deleted!");
    res.redirect("/listings");
};
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"owner"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you request for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};