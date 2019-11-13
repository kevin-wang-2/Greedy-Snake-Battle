/*
 * A Simple Broadcasting Http Server for Greedy Snake competition
 */

const url = require("url");
const querystring = require('querystring');
const fs = require("fs");
const sort = require("./util.js").sort;

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
        let data = JSON.parse(fs.readFileSync(config["matchRoot"] + urlquery["match"] + ".match").toString());
        let start = (urlquery["page"] - 1) * 10;
        let end = start + 10;

        let outputJSON = [];
        for (; start < Math.min(end, data.length); start++) {
            outputJSON.push(data[start]);
        }

        res.send(JSON.stringify(outputJSON));
    });

    app.get("/getScoreBoard", (req, res) => {
        let urlquery = querystring.parse(url.parse(req.url).query);
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        if (!urlquery["page"]) {
            res.send(JSON.stringify(sort(userData, "score").slice(0, 10)));
        } else {
            res.send(JSON.stringify(sort(userData, "score").slice((urlquery["page"] - 1) * 10, urlquery["page"] * 10)));
        }
    });
}

exports.setRouter = setRouter;