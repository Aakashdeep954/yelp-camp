const express = require("express");
const router = express.Router();
const campGroundModel = require("../models/campGrounds");
const { isLoggedIn, isAuthor } = require("../middleware");
const campGroundsController = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary/cloudinary");
const upload = multer({ storage });

router.route("/")
      .get(campGroundsController.index)
      .post(
            isLoggedIn,
            upload.array("image"),
            campGroundsController.createCampGround
      );

router.get("/new", isLoggedIn, campGroundsController.renderNewForm);

router.route("/:id")
      .get(campGroundsController.showCampGround)
      .put(
            isLoggedIn,
            isAuthor,
            upload.array("image"),
            campGroundsController.updateCampGround
      )
      .delete(isLoggedIn, isAuthor, campGroundsController.deleteCampGround);

router.get(
      "/:id/edit",
      isLoggedIn,
      isAuthor,
      campGroundsController.renderEditForm
);

module.exports = router;
