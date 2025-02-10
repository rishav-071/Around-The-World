const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');

const validateListing = (req, res, next) => {
    let valid = listingSchema.validate(req.body.listing);
    if(valid.error){
        let erroeMsg=valid.error.details.map((err)=>err.message).join(',');
        throw new ExpressError(400, erroeMsg);
    }
    else next();
}

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

//Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('reviews');
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
}));

//Create Route
router.post('/', validateListing, wrapAsync(async (req, res) => {
    let listing = new Listing(req.body.listing);
    let result = await listing.save();
    req.flash('success', 'Successfully added a new listing!');
    res.redirect('/listings');
}));

//Edit Route
router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing });
}));

//Update Route
router.patch('/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing);
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
}));

module.exports = router;