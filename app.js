if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const  express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MOngoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const MongoStore = require('connect-mongo');

const dbUlr= process.env.MONGODB_URL;
async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); //this is local connection
      await mongoose.connect(dbUlr);     // this mongo atlas connection
};
  
main()
 .then(() => {
    console.log("connection successful");
 })
 .catch((err) => {
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUlr,
    crypto: {
        secret: process.env.SECRETE,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("ERROR iin MONGO SESSION STORE",  err);
});

const sessionOption = {
    store,
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
 

 app.get("/",(req, res)=>{
   res.redirect("/listings");
 });
  
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingsRouter );
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// Error handeling
// if any page not found this response is send
app.all("*", (err, req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next)=>{
    let { statusCode=500, message ="sonething went wrong" } = err;
    res.render("error.ejs", { message});
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
