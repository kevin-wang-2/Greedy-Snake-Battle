/*
 * The battling and compiling server of Jigang FA19's Lab8 Greedy Snake
 */

const fs = require("fs");
const Match = require("./execute.js").Match;
const utils = require("./util.js");
const app = require("./httpServer.js").app;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

let matchCnt = 0;

(function begin() {
    app.listen(8000);

    setInterval(() => {
        if(matchCnt > config["maxMatchCnt"]) return;
        let match = new Match(); // Initialize a match
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let uidA, uidB;
        uidA = Math.floor(Math.random() * userData.length);
        let filtered = utils.filter(userData,
            (a) => {
                return (Math.abs(a.data["score"] - userData[uidA]["score"]) < config["scoreBoundary"] && a.id !== uidA);
            });
        if (filtered.length === 0) return;
        uidB = filtered[Math.floor(Math.random() * filtered.length)].id;

        if (userData[uidA]["bin"] === "" || userData[uidB]["bin"] === "") return;

        match.setExecutable(config["binRoot"] + userData[uidA]["bin"], config["binRoot"] +userData[uidB]["bin"]);
        matchCnt++;
        match.execute((result) => {
            let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
            let matchName = (new Date()).valueOf().toString() + ".match";
            matchData.push({userA: uidA, userB: uidB, result: result, details: matchName});
            if (matchData.length > config["maxMatchRecord"]) {
                fs.unlinkSync(config["matchRoot"] + matchData.shift()["details"]);
            }
            fs.writeFile(config["matchRoot"] + matchName, JSON.stringify(match.record), () => {
            });
            fs.writeFileSync(config["matchData"], JSON.stringify(matchData));

            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            let scoreA = userData[uidA]["score"], scoreB = userData[uidB]["score"];
            if(result.winner === 1) {
                userData[uidA]["score"] += 2 * (Math.max(scoreB - scoreA, 1));
                userData[uidB]["score"] -= 2 * (Math.max(scoreB - scoreA, 1));
                userData[uidA]["win"]++;
                userData[uidB]["lose"]++;
            } else if (result.winner === 2) {
                userData[uidA]["score"] -= 2 * (Math.max(scoreA - scoreB, 1));
                userData[uidB]["score"] += 2 * (Math.max(scoreA - scoreB, 1));
                userData[uidB]["win"]++;
                userData[uidA]["lose"]++;
            } else {
                userData[uidA]["score"] += 0.5 * (scoreB - scoreA);
                userData[uidB]["score"] -= 0.5 * (scoreB - scoreA);
                userData[uidB]["draw"]++;
                userData[uidA]["draw"]++;
            }
            matchCnt--;
            fs.writeFileSync(config["userData"], JSON.stringify(userData));
        })
    }, 1000);

})();