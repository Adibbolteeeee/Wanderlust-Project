const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");





main()
.then(() => {
    console.log("Database connection successful...");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async() => {
    //Deleting Testing Data Inserted Previously (If Exists)
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:'68850903364c3683daf66ad7'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized...");
}

initDB();