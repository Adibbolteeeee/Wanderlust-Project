if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const Listing = require("./models/listing.js");

//setting up ejs 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));



//Mongo Session Store 
const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto : {
        secret : process.env.SESSION_SECRET,
    },
    touchAfter : 24 * 3600, //3600(seconds)
});

store.on("error",()=> {
    console.log("Error in Mongo Session Store",err);
});

//setup session before using passport for authentication
const sessionOptions = {
    store : store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};


app.use(session(sessionOptions));
app.use(flash()); // use flash before routes

app.use(passport.initialize()); //initializes the passport
app.use(passport.session()); //use passport session after initialization    
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //storing the information of user into session is called serialization
passport.deserializeUser(User.deserializeUser()); //deleting the information of user after the session ends is called deserialization


//Database connection
main()
.then(() => {
    console.log("Database connection successful...");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}



app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("",userRouter);

//Error handling middleware
app.use((req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next) => {
   let {statusCode = 500, message = "Something Went Wrong!"} = err;
   res.status(statusCode).render("listings/error.ejs", {err})
});

//Starting the Server
app.listen(port,() => {
    console.log(`Server is listening on port : ${port}`);
});