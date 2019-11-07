/*
 * The battling and compiling server of Jigang FA19's Lab8 Greedy Snake
 */

const fs = require("fs");
const Match = require("./execute.js").Match;
const utils = require("./util.js");
const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

let matchCnt = 0;

(function begin() {
    setInterval(() => {
        if(matchCnt > config["maxMatchCnt"]) return;
        let match = Match(); // Initialize a match
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let uidA, uidB;
        do {
            uidA = Math.random() * userData.length;
            let filtered = utils.filter(userData,
                (a) => {
                    return Math.abs(a["data"]["score"] - userData[uidA]["score"]) < config["scoreBoundary"]
                });
            uidB = filtered[Math.random() * filtered.length].id;
        } while(userData[uidA]["bin"] === "" || userData[uidB]["bin"] === "");

        match.setExecutable(userData[uidA]["bin"], userData[uidB]["bin"]);
        matchCnt++;
        match.execute((result) => {
            let matchData = JSON.parse(fs.readFileSync(config["matchData"]).toString());
            matchData.push({userA:uidA, userB:uidB, result: result, details:match.record});
            fs.writeFileSync(config["matchData"], matchData.stringify());
            matchCnt--;
        })
    }, 1000);
})();