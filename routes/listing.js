const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        let allListings = await Listing.find();
        res.render("listings/index.ejs", { allListings });
    })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id)
            .populate({path: "reviews", populate: {path: "author"}})
            .populate("owner");
        if (!listing) {
            req.flash("error", "Cannot find that listing!");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    })
);

//Create Route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        let listing = new Listing(req.body.listing);
        listing.owner = req.user._id;
        let result = await listing.save();
        req.flash("success", "Successfully added a new listing!");
        res.redirect("/listings");
    })
);

//Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Cannot find that listing!");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    })
);

//Update Route
router.patch(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = req.body.listing;
        await Listing.findByIdAndUpdate(id, listing);
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    })
);

//Delete Route
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    })
);

module.exports = router;
