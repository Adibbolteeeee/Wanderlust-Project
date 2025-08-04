//Database connection
const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true,
    },
    image:{
        url : String,
        filename : String,
    },
    price:Number,
    location:String,
    country:String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref: "User",
    },
    category : {
        type : String,
        enum : ["trending","rooms", 'iconic cities','mountains','castles','amazing pools','camping','farms','arctic','domes','boats'],
    }
});

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing.reviews.length) {
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;