const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let valid = reviewSchema.validate(req.body.review);
    if(valid.error){
        let erroeMsg=valid.error.details.map((err)=>err.message).join(',');
        throw new ExpressError(400, erroeMsg);
    }
    else next();
}

//Review
//Post Review Route
router.post('/', validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${id}`);
}));

//Delete Review Route
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;