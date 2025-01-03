const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default:
            "https://cdn.pixabay.com/photo/2024/12/26/21/02/firenze-9292729_1280.jpg",
        set: (url) =>
            url === ""
                ? "https://cdn.pixabay.com/photo/2024/12/26/21/02/firenze-9292729_1280.jpg"
                : url,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;