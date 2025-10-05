const User = require("../models/user.js");

module.exports.signUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signUp = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
    const user1 = new User({
        username:username,
        email:email,
    });
    let registeredUser = await User.register(user1,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to Wanderlust");
         res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};
module.exports.loginInForm = async (req,res)=>{
res.render("users/login.ejs");
};
module.exports.logIn = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
};
module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You looged out successfully");
        res.redirect("/listings");
    })
};