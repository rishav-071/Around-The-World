const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingSchema = require('./schema.js');
const { error } = require("console");

app.listen(port, () => {
    console.log("Server is running on port 3000");
});

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
    
const validateListing = (req, res, next) => {
    let valid = listingSchema.validate(req.body.listing);
    if(valid.error){
        let erroeMsg=valid.error.details.map((err)=>err.message).join(',');
        throw new ExpressError(400, erroeMsg);
    }
    else next();
}

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
}));

//Create Route
app.post('/listings', validateListing, wrapAsync(async (req, res) => {
    let listing = new Listing(req.body.listing);
    let result = await listing.save();
    res.redirect('/listings');
}));

//Edit Route
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

//Update Route
app.patch('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('listings/error.ejs',{err});
    // res.status(statusCode).send(message);
});