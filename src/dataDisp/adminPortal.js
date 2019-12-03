const url = require("url");
const querystring = require('querystring');
const fs = require("fs");
const sort = require("../util.js").sort;
const unorderFilter = require("../util.js").filter;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.setRouter = function (app) {
    app.get("/resetScore", (req, res) => {
        if (!req.session.token) {
            res.end("[]");
        } else {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            if (userData[req.session.userID]["permission"] === 3) {
                if (!req.session.restoreScoreFlag) {
                    req.session.restoreScoreFlag = 1;
                    res.end("1");
                } else {
                    req.session.restoreScoreFlag = 0;
                    for (let i = 0; i < userData.length; i++) {
                        userData[i]["win"] = 0;
                        userData[i]["lose"] = 0;
                        userData[i]["draw"] = 0;
                        userData[i]["score"] = 0;
                    }
                    fs.writeFileSync(config["userData"], JSON.stringify(userData));
                    res.end("success");
                }
            }
        }
    });

    app.use("/resetPassword", (req, res) => {
        if (!req.session.token) {
            res.end("[]");
        } else {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            if (userData[req.session.userID]["permission"] === 3) {
                let path = url.parse(req.url).path.split("/");
                let uid = path[1];
                for (let i = 0; i < userData.length; i++) {
                    if (userData[i]["studentID"] === uid) {
                        userData[i]["password"] = "";
                        fs.writeFileSync(config["userData"], JSON.stringify(userData));
                        res.end("success");
                        return;
                    }
                }
                res.end("No user found!");
            } else {
                res.end("[]");
            }
        }
    });

    app.use("/su", (req, res) => {
        if (!req.session.token) {
            res.end("[]");
        } else {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            if (userData[req.session.userID]["permission"] === 3) {
                let path = url.parse(req.url).path.split("/");
                let uid = path[1];
                for (let i = 0; i < userData.length; i++) {
                    if (userData[i]["studentID"] === uid) {
                        req.session.userID = i;
                        res.end("success");
                        return;
                    }
                }
                res.end("No user found!");
            } else {
                res.end("[]");
            }
        }
    })
};