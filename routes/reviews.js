const express = require("express");
const router = express.Router({ mergeParams: true });
const campGroundModel = require("../models/campGrounds");
const reviewModel = require("../models/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewsController = require("../controllers/reviews");

router.post("/", isLoggedIn, reviewsController.createReview);

router.delete(
      "/:reviewId",
      isLoggedIn,
      isReviewAuthor,
      reviewsController.deleteReview
);

module.exports = router;
