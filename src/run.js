/*
 * The battling and compiling server of Jigang FA19's Lab8 Greedy Snake
 */

const fs = require("fs");
const Match = require("./execute.js").Match;
const utils = require("./util.js");
const app = require("./httpServer.js").app;
const execSync = require("child_process").execSync;
const crypto = require('crypto');

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

let matchCnt = 0;
let cleanflag = false;

(function begin() {
    setInterval(() => {
        if ((matchCnt > config["maxMatchCnt"]) || cleanflag) return;
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

        console.log("Competition Between " + userData[uidA]["name"] + " and " + userData[uidB]["name"]);

        match.setExecutable(config["binRoot"] + userData[uidA]["bin"], config["binRoot"] + userData[uidB]["bin"]);
        matchCnt++;
        match.execute((result) => {
            let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
            const md5 = crypto.createHash('md5');
            let matchName = md5.update((new Date()).valueOf().toString()).digest("hex").toString() + ".match";
            matchData.push({userA: uidA, userB: uidB, result: result, details: matchName});
            if (matchData.length > config["maxMatchRecord"]) {
                try {
                    fs.unlinkSync(config["matchRoot"] + matchData.shift()["details"]);
                } catch (e) {
                    matchData.shift();
                }
            }
            fs.writeFile(config["matchRoot"] + matchName, JSON.stringify(match.record), () => {
            });
            fs.writeFileSync(config["matchData"], JSON.stringify(matchData));

            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            let scoreA = userData[uidA]["score"], scoreB = userData[uidB]["score"];
            let eta = 0.05;
            if (result.winner === 1) {
                userData[uidA]["score"] += Math.ceil(eta * (50 + Math.max(scoreB - scoreA, 0)));
                userData[uidB]["score"] -= Math.ceil(eta * (50 + Math.max(scoreB - scoreA, 0)));
                userData[uidA]["win"]++;
                userData[uidB]["lose"]++;
            } else if (result.winner === 2) {
                userData[uidA]["score"] -= Math.ceil(eta * (50 + Math.max(scoreA - scoreB, 0)));
                userData[uidB]["score"] += Math.ceil(eta * (50 + Math.max(scoreA - scoreB, 0)));
                userData[uidB]["win"]++;
                userData[uidA]["lose"]++;
            } else {
                userData[uidA]["score"] += Math.ceil(eta * (scoreB - scoreA));
                userData[uidB]["score"] -= Math.ceil(eta * (scoreB - scoreA));
                userData[uidB]["draw"]++;
                userData[uidA]["draw"]++;
            }
            matchCnt--;
            if (matchCnt < 0) matchCnt = 0;
            if (matchCnt === 0) {
                console.log(">>> Clean");
                execSync("killall", ["-u runner"]);
                cleanflag = false;
            }
            fs.writeFileSync(config["userData"], JSON.stringify(userData));
        })
    }, 1000);

    setInterval(() => {
        cleanflag = true;
    }, 60000)

})();
