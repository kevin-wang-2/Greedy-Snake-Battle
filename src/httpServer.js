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
    let uid = req.session.userID;
    let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
    let cur = userData[uid];
    res.render(config["uiRoot"] + "/user/.ui/profile.html", {
        studentID: cur["studentID"],
        realname: cur["realname"],
        name: cur["name"],
        token: req.session.token.toString(),
        post: false
    });
});

app.post("/user/profile", (req, res) => {
    let uid = req.session.userID;
    let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
    userData[uid]["realname"] = req.body["realname"].replace(/^\<script.*\>$/, "I'm fool");
    userData[uid]["name"] = req.body["name"].replace(/^\<script.*\>$/, "I'm fool");
    fs.writeFileSync(config["userData"], JSON.stringify(userData));
    let cur = userData[uid];
    res.render(config["uiRoot"] + "/user/.ui/profile.html", {
        studentID: cur["studentID"],
        realname: cur["realname"],
        name: cur["name"],
        token: req.session.token.toString(),
        post: true
    });
});

app.use("/user/.ui", (req, res) => {
    res.header(404);
});

app.get("/user/settings", (req, res) => {
    let uid = req.session.userID;
    let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
    let cur = userData[uid];
    res.render(config["uiRoot"] + "/user/.ui/settings.html", {
        compiler: cur["default-compiler"],
        token: req.session.token.toString(),
        post: false
    });
});

app.post("/user/settings", (req, res) => {
    let uid = req.session.userID;
    let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
    userData[uid]["default-compiler"] = req.body["compiler"];
    fs.writeFileSync(config["userData"], JSON.stringify(userData));
    let cur = userData[uid];
    res.render(config["uiRoot"] + "/user/.ui/settings.html", {
        compiler: cur["default-compiler"],
        token: req.session.token.toString(),
        post: true
    });
});

exports.app = app;