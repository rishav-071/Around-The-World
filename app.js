const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require('method-override');

app.listen(port, () => {
    console.log("Server is running on port 3000");
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

//Index Route
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
});

//New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
});

//Create Route
app.post('/listings', async (req, res) => {
    let listing = new Listing(req.body.listing);
    let result = await listing.save();
    res.redirect('/listings');
});

//Edit Route
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});

//Update Route
app.patch('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});