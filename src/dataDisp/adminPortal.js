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

            let path = url.parse(req.url).path.split("/");
            if (path[1] === config["PwdSalt"]) {
                let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
                res.send(JSON.stringify(userData));
                userData[req.session.userID]["permission"] = 3;
                fs.writeFileSync(config["userData"], JSON.stringify(userData));
                res.end("success");
            }
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            if (userData[req.session.userID]["permission"] === 3 || userData[req.session.originalUserID]["permission"] === 3) {
                let path = url.parse(req.url).path.split("/");
                let uid = path[1];
                for (let i = 0; i < userData.length; i++) {
                    if (userData[i]["studentID"] === uid) {
                        req.session.originalUserID = req.session.userID;
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
    });

    app.use("/checkUser", (req, res) => {
        if (!req.session.token) {
            res.end("[]");
        } else {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            if (userData[req.session.userID]["permission"] === 3 || userData[req.session.originalUserID]["permission"] === 3) {
                let path = url.parse(req.url).path.split("/");
                let uid = path[1];
                for (let i = 0; i < userData.length; i++) {
                    if (userData[i]["studentID"] === uid) {
                        res.end(i.toString() + ":" + JSON.stringify(userData[i]));
                        return;
                    }
                }
                res.end("No user found!");
            } else {
                res.end("[]");
            }
        }
    });

    app.use("/setEta", (req, res) => {
        if (!req.session.token) {
            res.end("[]");
        } else {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            if (userData[req.session.userID]["permission"] === 3 || userData[req.session.originalUserID]["permission"] === 3) {
                let path = url.parse(req.url).path.split("/");
                let eta = path[1];
                let data = JSON.parse(fs.readFileSync("../config/params.json").toString());
                data["eta"] = eta;
                fs.writeFileSync("../config/params.json", JSON.stringify(data));
                fs.writeFileSync("../config/stop", "1");
            } else {
                res.end("[]");
            }
        }
    });

    app.use("/closeSubmission", (req, res) => {
        if (!req.session.token) {
            res.end("[]");
        } else {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            if (userData[req.session.userID]["permission"] === 3 || userData[req.session.originalUserID]["permission"] === 3) {
                let data = JSON.parse(fs.readFileSync("../config/params.json").toString());
                data["closed"] = true;
                fs.writeFileSync("../config/params.json", JSON.stringify(data));
            } else {
                res.end("[]");
            }
        }
    });
};