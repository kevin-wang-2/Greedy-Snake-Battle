/*
 * The server backward for greedysnake
 */

const express = require("express");

const url = require("url");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
//const CSRF = require("./validation/CSRFJar.js");

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

app.use("/submission/", (req, res, next) => {
    if (!req.session.token) {
        res.render(config["uiRoot"] + "/submission/.ui/nologin.html")
    } else {
        next();
    }
});

app.use("/user/.ui", (req, res) => {
    res.header(404);
});

app.use("/submission/.ui", (req, res) => {
    res.header(404);
});
app.use("/match/.ui", (req, res) => {
    res.header(404);
});

app.use((req, res, next) => {
    if (fs.existsSync(config["uiRoot"] + url.parse(req.url).pathname)) {
        if (fs.lstatSync(config["uiRoot"] + url.parse(req.url).pathname).isFile())
            if (path.extname(url.parse(req.url).pathname) === ".html")
                res.render(config["uiRoot"] + url.parse(req.url).pathname);
            else
                res.end(fs.readFileSync(config["uiRoot"] + url.parse(req.url).pathname));
        else if (fs.existsSync(config["uiRoot"] + url.parse(req.url).pathname + "/index.html"))
            res.render(config["uiRoot"] + url.parse(req.url).pathname + "/index.html");
        else next();
    } else next();
});

require("./ui/user.js").setRouter(app);
require("./dataDisp/scoreDispServer").setRouter(app);
require("./dataDisp/adminPortal").setRouter(app);
require("./ui/auth.js").setRouter(app);
require("./ui/submissions.js").setRouter(app);
require("./ui/match.js").setRouter(app);

exports.app = app;