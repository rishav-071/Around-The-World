const { listingSchema, reviewSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError');
const Listing = require('./models/listing');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl.split('/reviews')[0]; // If user is not logged in, save the current URL in session without reviews parameter, so that user can be redirected to the same URL after login. If it is not done, then it will redirect to the URL having page not found error, when user is not logged in and trying to delete a review.
        req.flash('error', 'You must be signed in to add a new listing!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) res.locals.redirectUrl = req.session.redirectUrl;
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error', 'You do not have permission to do this!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let valid = listingSchema.validate(req.body.listing);
    if (valid.error) {
        let erroeMsg = valid.error.details.map((err) => err.message).join(",");
        throw new ExpressError(400, erroeMsg);
    } else next();
};

module.exports.validateReview = (req, res, next) => {
    let valid = reviewSchema.validate(req.body.review);
    if(valid.error){
        let erroeMsg=valid.error.details.map((err)=>err.message).join(',');
        throw new ExpressError(400, erroeMsg);
    }
    else next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};