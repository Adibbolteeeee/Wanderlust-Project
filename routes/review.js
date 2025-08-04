const express = require('express');
const router = express.Router({mergeParams:true}); //mergeParams used to get id 
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewOwner} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const review = require('../models/review.js');

router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.addNewReview)
);

//Delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewOwner,
    wrapAsync(reviewController.deleteReview)
);


module.exports = router;