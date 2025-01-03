const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;

app.listen(port, () => {
    console.log("Server is running on port 3000");
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/atw");
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World");
});
