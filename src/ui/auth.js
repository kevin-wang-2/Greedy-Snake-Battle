const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
let crypto = require("crypto");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

function sha512(password, salt) {
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    let value = hash.digest("hex");
    return {
        salt: salt,
        passwordHash: value
    }
}

exports.setRouter = function (app) {
    app.post("/oauth", (req, res) => {
        let params = querystring.parse(url.parse(req.url).query);
        if (params["fake"]) {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["studentID"] === req.body["jaccountID"]) {
                    req.session.token = "f" + req.body["jaccountID"];
                    req.session.userID = i;
                    res.redirect("/");
                    res.end();
                } else {
                    res.render(config["uiRoot"] + "/oauth/login.html", {
                        token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                        fail: true
                    });
                    return;
                }
            }
        } else {
            let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["studentID"] === req.body["studentId"].toString()) {
                    if (sha512(req.body["password"], config["PwdSalt"]).passwordHash === userData[i]["password"]) {
                        req.session.token = sha512((new Date()).valueOf().toString(), userData[i]["studentID"] + config["CSRFKey"]).passwordHash;
                        req.session.userID = i;
                        res.redirect("/");
                        res.end();
                        return;
                    } else {
                        res.render(config["uiRoot"] + "/oauth/login.html", {
                            token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                            fail: true
                        });
                        return;
                    }
                }
            }

            let studentList = JSON.parse(fs.readFileSync(config["studentList"]).toString());
            for (let i = 0; i < studentList.length; i++) {
                if (studentList[i]["studentID"] === req.body["studentId"]) {
                    let curData = {
                        studentID: studentList[i]["studentID"],
                        realname: studentList[i]["name"],
                        name: studentList[i]["name"],
                        uid: userData.length,
                        win: 0,
                        draw: 0,
                        lose: 0,
                        score: 0,
                        permission: 1,
                        "default-compiler": "c++17",
                        password: sha512(req.body["password"], config["PwdSalt"]).passwordHash,
                        bin: ""
                    };
                    userData.push(curData);
                    fs.writeFileSync(config["userData"], JSON.stringify(userData));
                    req.session.token = sha512((new Date()).valueOf().toString(), userData[i]["studentID"] + config["CSRFKey"]).passwordHash;
                    req.session.userID = userData.length - 1;
                    res.redirect("/");
                    res.end();
                    return;
                }
            }

            res.render(config["uiRoot"] + "/oauth/login.html", {
                token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                fail: true
            });
        }
    });

    app.get("/oauth/session", (req, res) => {
        let params = querystring.parse(url.parse(req.url).query);
        if (params["key"] === "userID") {
            if (req.session.token) {
                res.end(req.session.userID.toString());
                return;
            }
        }
        res.end("[]");
    });

    app.get("/oauth/login", (req, res) => {
        res.render(config["uiRoot"] + "/oauth/login.html", {
            token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
            fail: false
        });
    });

    app.post("/oauth/logout", (req, res) => {
        req.session.token = null;
        req.session.userID = null;
        res.redirect("/");
    });
};