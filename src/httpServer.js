/*
 * The server backward for greedysnake
 */

const express = require("express");

const url = require("url");
const fs = require("fs");
const path = require("path");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

app = express();

app.engine("html", require("express-art-template"));
app.set("views", "");

app.use((req, res, next) => {
    if (fs.existsSync(config["uiRoot"] + url.parse(req.url).pathname)) {
        if (fs.lstatSync(config["uiRoot"] + url.parse(req.url).pathname).isFile())
            if (path.extname(url.parse(req.url).pathname) === ".html")
                res.render(config["uiRoot"] + url.parse(req.url).pathname);
            else
                res.end(fs.readFileSync(config["uiRoot"] + url.parse(req.url).pathname));
        else if (fs.existsSync(config["uiRoot"] + url.parse(req.url).pathname + "/index.html"))
            res.render(config["uiRoot"] + url.parse(req.url).pathname + "index.html");
        else next();
    } else next();
});

exports.app = app;