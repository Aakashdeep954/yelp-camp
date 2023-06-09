const campGroundModel = require("../models/campGrounds");
const { cloudinary } = require("../cloudinary/cloudinary");
const mapBoxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.map_box_token;

const geoCoder = mapBoxGeoCoding({ accessToken: mapBoxToken });

module.exports.index = async (request, response) => {
      const campGrounds = await campGroundModel.find({});
      response.render("campGrounds", { campGrounds });
};

module.exports.renderNewForm = async (request, response) => {
      response.render("new");
};

module.exports.createCampGround = async (request, response) => {
      const geoData = await geoCoder
            .forwardGeocode({
                  query: request.body.campground.location,
                  limit: 1,
            })
            .send();
      const newCampGround = new campGroundModel(request.body.campground);
      newCampGround.author = request.user._id;
      newCampGround.image = request.files.map((f) => ({
            url: f.path,
            fileName: f.filename,
      }));
      newCampGround.geometry = geoData.body.features[0].geometry;
      await newCampGround.save();
      console.log(newCampGround);
      request.flash("success", "wohoo! succesfully created the campground");
      response.redirect(`/campgrounds/${newCampGround._id}`);
};

module.exports.showCampGround = async (request, response, next) => {
      let { id } = request.params;
      try {
            let campGround = await campGroundModel
                  .findById(id)
                  .populate({ path: "reviews", populate: { path: "author" } })
                  .populate("author");
            response.render("show", { campGround });
      } catch (e) {
            next(e);
      }
};

module.exports.renderEditForm = async (request, response) => {
      const { id } = request.params;
      const campGround = await campGroundModel.findById(id);
      response.render("edit", { campGround });
};

module.exports.updateCampGround = async (request, response, next) => {
      try {
            const { id } = request.params;
            const data = request.body;
            const campGround = await campGroundModel.findByIdAndUpdate(
                  id,
                  data.campground
            );
            const imagesArray = request.files.map((f) => ({
                  url: f.path,
                  fileName: f.fileName,
            }));
            campGround.image.push(...imagesArray);
            await campGround.save();
            if (request.body.deletedImages) {
                  for (let fileName of request.body.deletedImages) {
                        await cloudinary.uploader.destroy(fileName);
                  }
                  await campGround.updateOne({
                        $pull: {
                              image: {
                                    fileName: {
                                          $in: request.body.deletedImages,
                                    },
                              },
                        },
                  });
            }

            request.flash("success", "yaay updated successfully");
            response.redirect(`/campgrounds/${id}`);
      } catch (e) {
            next(e);
      }
};

module.exports.deleteCampGround = async (request, response) => {
      const { id } = request.params;
      await campGroundModel.findByIdAndDelete(id);
      request.flash("success", "yayyyy! successfully deleted the campground");
      response.redirect("/campgrounds");
};
