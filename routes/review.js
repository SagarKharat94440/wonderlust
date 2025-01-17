const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor, validateReview} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");

//create review
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.create ));

//review delete
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroy));

module.exports = router;