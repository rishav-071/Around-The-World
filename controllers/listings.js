const { models } = require("mongoose");
const Listing = require("../models/listing");
const axios = require("axios");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = { url, filename };
    let fetchUrl = `https://api.olamaps.io/places/v1/geocode?address=${listing.location}&language=English&api_key=${process.env.MAP_API_KEY}`;
    let data = await axios.get(fetchUrl);
    let { lng, lat } = data.data.geocodingResults[0].geometry.location;
    listing.geometry = { type: "Point", coordinates: [lng, lat] };
    let result = await listing.save();
    req.flash("success", "Successfully added a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    listing.image.url = listing.image.url.replace("upload", "upload/w_250");
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    listing = await Listing.findByIdAndUpdate(id, listing);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
