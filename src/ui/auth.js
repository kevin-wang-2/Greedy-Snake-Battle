const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
let crypto = require("crypto");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

let globalUserData = [];

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
            // In test environment
            let userData;
            try {
                userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
                globalUserData = userData;
            } catch (e) {
                userData = globalUserData;
            }
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["studentID"] === req.body["jaccountID"]) {
                    req.session.token = "f" + req.body["jaccountID"];
                    req.session.userID = i;
                    res.redirect("/");
                    res.end();
                } else {
                    res.render(config["uiRoot"] + "/oauth/login.html", {
                        token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                        fail: 1
                    });
                    return;
                }
            }
        } else {
            // In Production Environment
            // TODO: Substitute with formal database operation
            let userData;
            try {
                userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
                globalUserData = userData;
            } catch (e) {
                userData = globalUserData;
            }

            // Find User and authenticate
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["studentID"] === req.body["studentId"].toString()) {
                    if (sha512(req.body["password"], config["PwdSalt"]).passwordHash === userData[i]["password"]) {
                        req.session.token = sha512((new Date()).valueOf().toString(), userData[i]["studentID"] + config["CSRFKey"]).passwordHash;
                        req.session.userID = userData[i]["uid"];
                        res.redirect("/");
                        res.end();
                        return;
                    } else if (userData[i]["password"] === "") {
                        // After reset
                        // TODO: Write formal password reset page
                        userData[i]["password"] = sha512(req.body["password"], config["PwdSalt"]).passwordHash;
                        fs.writeFileSync(config["userData"], JSON.stringify(userData));
                        req.session.token = sha512((new Date()).valueOf().toString(), userData[i]["studentID"] + config["CSRFKey"]).passwordHash;
                        req.session.userID = userData[i]["uid"];
                        res.redirect("/");
                        res.end();
                        return;
                    } else {
                        res.render(config["uiRoot"] + "/oauth/login.html", {
                            token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                            fail: 1
                        });
                        return;
                    }
                }
            }

            // Register for a new user from the student list
            // TODO: Add another channel to allow guest registration
            const md5 = crypto.createHash("md5");
            let studentList = JSON.parse(fs.readFileSync(config["studentList"]).toString());
            for (let i = 0; i < studentList.length; i++) {
                if (studentList[i]["studentID"] === req.body["studentId"]) {
                    let curData = {
                        studentID: studentList[i]["studentID"],
                        realname: studentList[i]["name"],
                        name: studentList[i]["name"],
                        uid: md5.update(studentList[i]["studentID"]).digest(), // Use the hash of student ID to create fake UUID
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
                    req.session.token = sha512((new Date()).valueOf().toString(), studentList[i]["studentID"] + config["CSRFKey"]).passwordHash;
                    req.session.userID = md5.update(studentList[i]["studentID"]).digest("hex");
                    res.redirect("/");
                    res.end();
                    return;
                }
            }

            // Show failure message
            res.render(config["uiRoot"] + "/oauth/login.html", {
                token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                fail: 2
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
            fail: 0
        });
    });

    app.post("/oauth/logout", (req, res) => {
        req.session.token = null;
        req.session.userID = null;
        res.redirect("/");
    });

    app.get("/oauth/register", (req, res) => {
        res.render(config["uiRoot"] + "/oauth/register.html", {
            token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
            fail: 0
        });
    });

    app.post("/oauth/register", (req, res, next) => {
        if (req.body["password"] !== req.body["confirm"]) {
            next();
            return;
        }

        // 1. Check duplicated username
        // TODO: Substitute with formal database operation
        let userData;
        try {
            userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            globalUserData = userData;
        } catch (e) {
            userData = globalUserData;
        }

        for (let i = 0; i < userData.length; i++) {
            if (userData[i]["studentID"] === req.body["studentId"]) {
                res.render(config["uiRoot"] + "/oauth/register.html", {
                    token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                    fail: 1
                });
                return;
            }
        }

        // 2. Check existed studentID
        let studentList = JSON.parse(fs.readFileSync(config["studentList"]).toString());
        for (let i = 0; i < studentList.length; i++) {
            if (studentList[i]["studentID"] === req.body["studentId"]) {
                res.render(config["uiRoot"] + "/oauth/register.html", {
                    token: sha512((new Date()).valueOf().toString(), config["CSRFKey"]).passwordHash,
                    fail: 2
                });
                return;
            }
        }

        // 3. Register
        const md5 = crypto.createHash("md5");
        let curUid = md5.update(req.body["studentId"].toString()).digest("hex");
        let curData = {
            studentID: req.body["studentId"],
            realname: req.body["realname"],
            name: req.body["name"],
            uid: curUid, // Use the hash of student ID to create fake UUID
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
        req.session.token = sha512((new Date()).valueOf().toString(), req.body["studentId"] + config["CSRFKey"]).passwordHash;
        req.session.userID = curUid;
        res.redirect("/");
        res.end();
    })
};