const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

// index route
router.route("/")
   .get( wrapAsync( listingController.index))
   .post( 
       isLoggedIn,
    //    validateListing,
       upload.single("listing[image]"), 
       wrapAsync(listingController.create)
    );
    

//new route
router.get("/new",isLoggedIn, listingController.newform);

// show route
router.get("/:id", 
    wrapAsync(listingController.show));


//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

//Update route 
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"),  validateListing, wrapAsync(listingController.update));


// Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroy));

module.exports = router;