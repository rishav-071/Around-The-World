const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require('express-session');
const flash = require('connect-flash');

app.listen(port, () => {
    console.log("Server is running on port 3000");
});

const sessionOptions={
    secret: 'secterCode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine('ejs', ejsMate);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/atw");
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => console.log(err));
    
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use (session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('listings/error.ejs',{err});
});