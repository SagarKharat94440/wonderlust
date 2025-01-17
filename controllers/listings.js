const Listing = require("../models/listing.js");
const axios = require('axios');
const apiKey = process.env.MAP_API_KEY;

module.exports.index = async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
};

module.exports.newform = (req, res)=>{
    res.render("listings/new.ejs");
};

async function geocodeAddress(address) {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.items && data.items.length > 0) {
            const location = data.items[0];
            const latitude = location.position.lat;
            const longitude = location.position.lng;

            // Return geometry object in GeoJSON format
            return {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        } else {
            console.log('No geocoding results found for the address:', address);
            // If no results are found, throw an error
            throw new Error('Geocoding failed: No results found');
        }
    } catch (error) {
        console.error('Error with the geocoding request:', error);
        throw error; // Ensure the error is caught and handled in your create function
    }
}

module.exports.create = async( req, res, next)=>{
    const address = req.body.listing.location;

    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename};
    const geometry = await geocodeAddress(address);
        if (!geometry) {
            throw new Error('Failed to geocode address: Geometry is invalid.');
        }
  // Assign the geometry to the new listing
    newListing.geometry = geometry;
    
    let savedListing= await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created successfully");
    res.redirect("/listings");
};


module.exports.show = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
      })
      .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.edit =  async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings"); 
    }
   
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_200,w_200");
    req.flash("success", " Listing Edited successfully");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.update = async(req, res) =>{ 
    let { id }= req.params;0
    let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});

   if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
   }
   req.flash("success", " Listing Updated successfully");
   res.redirect("/listings");
};


module.exports.destroy = async(req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", " Listing Updated successfully");
    res.redirect("/listings");
};