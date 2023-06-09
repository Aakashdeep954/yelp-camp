const mongoose = require("mongoose");
const reviewModel = require("./reviews");

const imageSchema = mongoose.Schema({
      url: String,
      fileName: String,
});

imageSchema.virtual("thumbnail").get(function () {
      return this.url.replace("/upload", "/upload/w_200");
});
const options = { toJSON: { virtuals: true } };
const campGroundSchema = mongoose.Schema(
      {
            title: {
                  type: String,
            },
            price: {
                  type: Number,
            },
            description: {
                  type: String,
            },
            location: {
                  type: String,
            },
            image: [imageSchema],
            reviews: [
                  {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "reviews",
                  },
            ],
            author: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "users",
            },
            geometry: {
                  type: {
                        type: String,
                        enum: ["Point"],
                        required: "true",
                  },
                  coordinates: [
                        {
                              type: Number,
                              required: true,
                        },
                  ],
            },
      },
      options
);

campGroundSchema.virtual("properties.popUpMarkUp").get(function () {
      return `<a href="/campgrounds/${this._id}"> ${this.title} </a>`;
});

campGroundSchema.post("findOneAndDelete", async (doc) => {
      if (doc) {
            await reviewModel.deleteMany({
                  _id: {
                        $in: doc.reviews,
                  },
            });
      }
});
const campGroundModel = mongoose.model("campgrounds", campGroundSchema);
module.exports = campGroundModel;
