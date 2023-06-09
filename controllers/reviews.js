const campGroundModel = require("../models/campGrounds");
const reviewModel = require("../models/reviews");

module.exports.createReview = async (request, response) => {
      const { id } = request.params;
      const { review } = request.body;

      const campGround = await campGroundModel.findById(id);
      const newReview = new reviewModel(review);
      campGround.reviews.push(newReview);
      newReview.author = request.user._id;
      await newReview.save();
      await campGround.save();
      response.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (request, response) => {
      const { id, reviewId } = request.params;
      await campGroundModel.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
      });
      await reviewModel.findByIdAndDelete(reviewId);
      response.redirect(`/campgrounds/${id}`);
};
