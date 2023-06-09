const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
      body: {
            type: String,
      },
      rating: {
            type: Number,
      },
      author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
      },
});

const reviewModel = mongoose.model("reviews", reviewSchema);
module.exports = reviewModel;
