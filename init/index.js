const mongoose = require("mongoose");
const { data } = require("./data.js");
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
    await Listing.insertMany(data)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
};

initDB();