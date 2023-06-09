const campGroundModel = require("./models/campGrounds");
const reviewModel = require("./models/reviews");

module.exports.isLoggedIn = (request, response, next) => {
      if (!request.isAuthenticated()) {
            request.session.returnTo = request.originalUrl;
            request.flash("error", "you must be logged in");
            response.redirect("/login");
            return;
      }
      next();
};

module.exports.storeReturnTo = (request, response, next) => {
      if (request.session.returnTo) {
            response.locals.returnTo = request.session.returnTo;
      }
      next();
};

module.exports.isAuthor = async (request, response, next) => {
      const { id } = request.params;
      const campGround = await campGroundModel.findById(id);
      if (!campGround.author.equals(request.user._id)) {
            request.flash("error", "you do not have permission");
            response.redirect(`/campgrounds/${id}`);
            return;
      }
      next();
};

module.exports.isReviewAuthor = async (request, response, next) => {
      const { id, reviewId } = request.params;
      const review = await reviewModel.findById(reviewId);
      if (!review.author.equals(request.user._id)) {
            request.flash("error", "you do not have permission");
            response.redirect(`/campgrounds/${id}`);
            return;
      }
      next();
};
