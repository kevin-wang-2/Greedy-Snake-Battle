/*
 * The server backward for greedysnake
 */

const express = require("express");

app = express();

app.engine("html", require("express-art-template"));

exports.app = app;