/*
 * A Simple Broadcasting Http Server for Greedy Snake competition
 */

const url = require("url");
const querystring = require('querystring');
const fs = require("fs");
const sort = require("../util.js").sort;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

function setRouter(app) {
    app.get("/getMatchData", (req, res) => {
        let urlquery = querystring.parse(url.parse(req.url).query);
        let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
        if (urlquery["count"]) {
            res.send(matchData.length.toString());
        } else {
            let outputJSON = [];
            for (let i = urlquery["start"]; i <= urlquery["end"]; i++) {
                outputJSON.push(matchData[i]);
            }
            res.send(JSON.stringify(outputJSON));
        }
    });

    app.get("/getMatchDetail", (req, res) => {
        let urlquery = querystring.parse(url.parse(req.url).query);
        try {
            let data = JSON.parse(fs.readFileSync(config["matchRoot"] + urlquery["match"] + ".match").toString());
        } catch (e) {
            res.send("[]");
            return;
        }
        let start = (urlquery["page"] - 1) * 10;
        let end = start + 10;

        let outputJSON = [];
        for (; start < Math.min(end, data.length); start++) {
            outputJSON.push(data[start]);
        }

        res.send(JSON.stringify(outputJSON));
    });

    app.get("/getScoreBoard", (req, res) => {
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        res.send(JSON.stringify(sort(userData, "score")));
    });

    app.get("/getUserInfo", (req, res) => {
        let urlquery = querystring.parse(url.parse(req.url).query);
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        if (urlquery["userID"]) {
            res.end(JSON.stringify(userData[parseInt(urlquery["userID"].toString())]));
        } else {
            res.end();
        }
    });

    app.get("/getSubmissionList", (req, res) => {
        if (!req.session.token) {
            res.end("[]");
        } else {
            let userID = req.session.userID;
            let submissionData = JSON.parse(fs.readFileSync(config["submissionData"]).toString());
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            let retJSON = [];

            for (let i = 0; i < submissionData.length; i++) {
                if (submissionData[i]["userID"] === userID) {
                    let cur = {
                        status: submissionData[i]["status"],
                        time: submissionData[i]["time"],
                        username: userData[req.session.userID]["name"],
                        compiler: submissionData[i]["compiler"]
                    };
                    retJSON.push(cur);
                }
            }

            res.end(JSON.stringify(retJSON.reverse()));
        }
    });
}

exports.setRouter = setRouter;