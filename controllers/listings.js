const Listing = require("../models/listing.js");


module.exports.index = async(req,res) => {
    //it will fetch all data as condition is not given
    const allListings = await Listing.find({})
    .catch((err) => {
        console.log(err);
    });
    res.render("listings/index.ejs",{allListings});
};

module.exports.newForm = (req,res) =>  {
    res.render("listings/new.ejs");
};

module.exports.addNewListing = async(req,res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing added!")
    res.redirect("/listings");
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    let listing =await Listing.findById(id)
    .populate({path:"reviews",
        populate : {
        path : "author",
    }}).populate("owner");
    
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    } 
    else {
        res.render("listings/show.ejs",{listing});
    }
};

module.exports.editListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else {
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing, originalImageUrl});
    }
};

module.exports.updateListing = async(req,res) => {
        let {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url,filename };
            await listing.save();
        }
        
        req.flash("success","Listing updated successfully!");
        res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted Successfully!");
    res.redirect("/listings");
};

module.exports.filterListing = async (req, res) => {
    const category = req.params.category;
    const allListings = await Listing.find({ category: category });
    res.render("listings/index", { allListings, selectedCategory: category });
};

//Searching listing with particular name
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

module.exports.searchListing = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.redirect("/listings");
  }

  const allListings = await Listing.find({
    location: { $regex: new RegExp("^" + query + "$", "i") }
  });

 if(allListings.length === 0) {
    req.flash("error",`There are currently no hotels available in ${query}.`)
    res.redirect("/listings");
  } 
  else {
    const formattedQuery = toTitleCase(query);
    res.render("listings/index", {
        allListings,
        selectedCity: formattedQuery,
    });
  }
};
