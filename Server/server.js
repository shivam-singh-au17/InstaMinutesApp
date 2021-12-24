require("dotenv").config();
const path = require("path");
const express = require("express");

const publicPath = path.join(__dirname, "./../Public");
var app = express();

const port = process.env.PORT;

app.use(express.static(publicPath));

app.listen(port, () => {
    console.log("Express server running on PORT :=>", port);
})

