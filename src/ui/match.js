const url = require("url");
const fs = require("fs");
const generatePager = require("./templateRender.js").generatePager;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.setRouter = function (app) {
    const matchList = (req, res) => {
        let path = url.parse(req.url).path.split("/");
        let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
        let pageCnt = matchData.length / 20;

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
        let matchId = parseInt(path[path.length - 1]);
        let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let curMatch = matchData[matchId];
        let user1 = userData[curMatch["userA"]];
        let user2 = userData[curMatch["userB"]];

        res.render(config["uiRoot"] + "/match/.ui/disp.html", {
            user1: user1["name"],
            user2: user2["name"],
            winner: curMatch["result"]["winner"],
            matchId: curMatch["details"]
        })
    });
};