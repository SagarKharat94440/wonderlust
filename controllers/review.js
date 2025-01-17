const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.create = async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("review saved");
    req.flash("success", "New Riview Created successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroy = async (req, res)=>{
    let {id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted successfully");
    res.redirect(`/listings/${id}`);
};