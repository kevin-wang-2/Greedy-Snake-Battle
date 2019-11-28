const fs = require("fs");


const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.setRouter = function (app) {
    app.get("/user/profile", (req, res) => {
        let uid = req.session.userID;
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let cur = userData[uid];
        res.render(config["uiRoot"] + "/user/.ui/profile.html", {
            studentID: cur["studentID"],
            realname: cur["realname"],
            name: cur["name"],
            token: req.session.token.toString(),
            post: false
        });
    });

    app.post("/user/profile", (req, res) => {
        let uid = req.session.userID;
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        userData[uid]["realname"] = req.body["realname"].replace(/\</g, "&lt;")
            .replace(/\>/g, "&gt;");
        userData[uid]["name"] = req.body["name"].replace(/\</g, "&lt;")
            .replace(/\>/g, "&gt;");
        fs.writeFileSync(config["userData"], JSON.stringify(userData));
        let cur = userData[uid];
        res.render(config["uiRoot"] + "/user/.ui/profile.html", {
            studentID: cur["studentID"],
            realname: cur["realname"],
            name: cur["name"],
            token: req.session.token.toString(),
            post: true
        });
    });

    app.get("/user/settings", (req, res) => {
        let uid = req.session.userID;
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let cur = userData[uid];
        res.render(config["uiRoot"] + "/user/.ui/settings.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: false
        });
    });

    app.post("/user/settings", (req, res) => {
        let uid = req.session.userID;
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        userData[uid]["default-compiler"] = req.body["compiler"];
        fs.writeFileSync(config["userData"], JSON.stringify(userData));
        let cur = userData[uid];
        res.render(config["uiRoot"] + "/user/.ui/settings.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: true
        });
    });
};