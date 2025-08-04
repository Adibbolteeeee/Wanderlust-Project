const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); //it will upload the files to cloudinary storage

// 🟢 1. Search route 
router.get("/search", listingController.searchListing);

// 🔵 2. Filter by category
router.get('/category/:category', wrapAsync(listingController.filterListing));

// 🟡 3. Index & create
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.addNewListing)
);

// 🟣 4. New listing form
router.get("/new", isLoggedIn, listingController.newForm);

// 🟤 5. Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// 🔴 6. Show/Update/Delete — must come after search route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

module.exports = router;
