// routes/listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { upload } = require("../config/multer.config.js"); 
const { uploadOnCloudinary } = require("../config/cloudConfig.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(upload.single("listing[image]"), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const result = await uploadOnCloudinary(req.file.path);
      if (!result) {
        return res.status(500).send("Failed to upload image to Cloudinary.");
      }
      res.send({ message: "Image uploaded successfully!", url: result.url });
    } catch (error) {
      res.status(500).send("Server error while uploading image.");
    }
  });

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
