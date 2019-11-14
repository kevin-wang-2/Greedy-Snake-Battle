/*
 * The server backward for greedysnake
 */

const express = require("express");

const url = require("url");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

app = express();

app.engine("html", require("express-art-template"));
app.set("views", "");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 3600 * 3,
    },
}));

app.use("/css", express.static(config["uiRoot"] + "/css"));
app.use("/js", express.static(config["uiRoot"] + "/js"));
app.use("/misc", express.static(config["uiRoot"] + "/misc"));

app.use("/user", (req, res, next) => {
    if (!req.session.token) {
        res.redirect("/");
    } else {
        next();
    }
});

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

app.get("/user/profile", (req, res) => {
    res.render(config["uiRoot"] + "/user/.ui/profile.html")
});

exports.app = app;