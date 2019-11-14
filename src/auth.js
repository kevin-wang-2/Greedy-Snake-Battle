const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

function setRouter(app) {
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
                }
            }
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
        if (config["testEnv"]) {
            res.redirect("/oauth/fake_jaccount.html");
        }
    });
}

exports.setRouter = setRouter;