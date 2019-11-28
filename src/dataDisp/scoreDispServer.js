/*
 * A Simple Broadcasting Http Server for Greedy Snake competition
 */

const url = require("url");
const querystring = require('querystring');
const fs = require("fs");
const sort = require("../util.js").sort;
const unorderFilter = require("../util.js").filter;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.setRouter = function (app) {
    app.get("/getMatchList", (req, res) => {
        let urlquery = querystring.parse(url.parse(req.url).query);
        let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString()).reverse();
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        if (urlquery["filter"]) {
            let filteredMatchData = unorderFilter(matchData, (cur) => {
                return cur["data"]["userA"] === req.session.userID || cur["data"]["userB"] === req.session.userID;
            });
            let outputJSON = [];
            for (let i = (parseInt(urlquery["page"]) - 1) * 20; i < Math.min(parseInt(urlquery["page"]) * 20, filteredMatchData.length); i++) {
                let user1 = userData[parseInt(matchData[filteredMatchData[i].id]["userA"])];
                let user2 = userData[parseInt(matchData[filteredMatchData[i].id]["userB"])];
                outputJSON.push({
                    matchid: matchData.length - filteredMatchData[i].id - 1,
                    status: matchData[filteredMatchData[i].id]["result"]["winner"],
                    user1: {id: user1["uid"], name: user1["name"], rating: user1["score"]}
                    ,
                    user2: {id: user2["uid"], name: user2["name"], rating: user2["score"]}
                });
            }
            res.send(JSON.stringify(outputJSON));
            return;
        }

        let outputJSON = [];
        for (let i = (parseInt(urlquery["page"]) - 1) * 20; i < Math.min(parseInt(urlquery["page"]) * 20, matchData.length); i++) {
            let user1 = userData[parseInt(matchData[i]["userA"])];
            let user2 = userData[parseInt(matchData[i]["userB"])];
            outputJSON.push({
                matchid: matchData.length - i - 1,
                status: matchData[i]["result"]["winner"],
                user1: {id: user1["uid"], name: user1["name"], rating: user1["score"]}
                ,
                user2: {id: user2["uid"], name: user2["name"], rating: user2["score"]}
            });
        }
        res.send(JSON.stringify(outputJSON));

    });

    app.get("/getMatchDetail", (req, res) => {
        let urlquery = querystring.parse(url.parse(req.url).query);
        let data;
        try {
            data = JSON.parse(fs.readFileSync(config["matchRoot"] + urlquery["match"]).toString());
        } catch (e) {
            res.send("[]");
            return;
        }

        let outputJSON = [];

        if (parseInt(urlquery["page"]) === 0) {
            outputJSON.push(data[0]);
        } else {
            let start = (urlquery["page"] - 1) * 50 + 1;
            let end = start + 50;

            for (; start < Math.min(end, data.length); start++) {
                outputJSON.push(data[start]);
            }
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
};