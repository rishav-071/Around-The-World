const mongoose = require("mongoose");
let { data } = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/atw");
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    data = data.map((listing) => {
        listing.owner = '67cc90c0cb9a667b4478e4dd';
        return listing;
    });
    await Listing.insertMany(data)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
};

initDB();