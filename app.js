if(process.env.NODE_ENV!="production"){
require("dotenv").config();
console.log(process.env.SECRET);
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const methodOverride = require("method-override");
const ejsMate =  require("ejs-mate");
const path = require("path");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

app.use(session({secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
    store:MongoStore.create({
        mongoUrl: process.env.ATLASDB_URL,
        crypto:{
            secret:process.env.SECRET
        },
        touchAfter: 24*3600 // updates session data after 1 day.
    })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let randomUser = new User({
//         email:"abc@gmail.com",
//         username:"random"
//     });
//     let registeredUser = await User.register(randomUser,"helloworld");
//     res.send(registeredUser);
// });
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//listing model-->
app.use("/listings",listings);

//review model-->
app.use("/listings/:id/reviews",reviews);

//user model-->
app.use("/",users);

//error handler
app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong!"} = err;
    res.status(status).render("error.ejs",{message});
});
// invalid route-->
app.use((req,res)=>{
    res.status(404).render("error.ejs",{message:"Page not found!"});
});
app.listen(port,()=>{
    console.log(`server is listening at ${port}`);
});