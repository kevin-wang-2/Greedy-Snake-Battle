const url = require("url");
const querystring = require('querystring');
const fs = require("fs");
const generatePager = require("./templateRender.js").generatePager;
const unorderFilter = require("../util.js").unorderFilter;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.setRouter = function (app) {
    const matchList = (req, res) => {
        let path = url.parse(req.url).path.split("/");
        let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
        let pageCnt = Math.floor(matchData.length / 20);

        if (path[path.length - 1] === "match" || path.length < 2 || (path.length >= 2 && path[path.length - 1] === "")) {
            res.render(config["uiRoot"] + "/match/.ui/list.html", {
                pager: generatePager(pageCnt, 1, "match/list"),
                page: 1
            });
        } else {
            res.render(config["uiRoot"] + "/match/.ui/list.html", {
                pager: generatePager(pageCnt, parseInt(path[path.length - 1]), "match/list"),
                page: parseInt(path[path.length - 1])
            });
        }
    };

    app.get("/match/", matchList);

    app.use('/match/list/', matchList);

    app.use("/match", (req, res) => {
        let path = url.parse(req.url).path.split("/");
        let matchId = path[path.length - 1];
        let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let curMatch = {};
        for (let i = 0; i < matchData.length; i++) {
            if (matchData[i]["details"] === matchId + ".match") {
                curMatch = matchData[i];
                break;
            }
        }
        let user1 = userData[curMatch["userA"]];
        let user2 = userData[curMatch["userB"]];

        res.render(config["uiRoot"] + "/match/.ui/disp.html", {
            user1: user1["name"],
            user2: user2["name"],
            winner: curMatch["result"]["winner"],
            matchId: curMatch["details"],
            exit: curMatch["result"]["error"].length === 0 ? "Normal Exit" : curMatch["result"]["error"][0]["msg"]
        })
    });

    app.get("/resetPager", (req, res) => {
        let urlquery = querystring.parse(url.parse(req.url).query);
        let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());

        if (urlquery["filter"]) {
            matchData = unorderFilter(matchData, (cur) => {
                return cur.data["userA"] === req.session.userID || cur.data["userB"] === req.session.userID;
            });
        }
        if (urlquery["search"]) {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            matchData = unorderFilter(matchData, (cur) => {
                return userData[cur["data"]["userA"]]["name"].indexOf(urlquery["search"]) !== -1 || userData[cur["data"]["userB"]]["name"].indexOf(urlquery["search"]) !== -1;
            });
        }

        let pageCnt = Math.floor(matchData.length / 20);
        res.send(generatePager(pageCnt, parseInt(urlquery["page"]), "match/list"));

    })
};