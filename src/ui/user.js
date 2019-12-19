const fs = require("fs");


const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

let globalUserData = [];

exports.setRouter = function (app) {
    app.get("/user/profile", (req, res) => {
        let uid = req.session.userID;

        // TODO: Replace with formal database operation
        let userData;
        try {
            userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            globalUserData = userData;
        } catch (e) {
            userData = globalUserData;
        }

        // TODO: Replace this with formal database operation
        function findUser(UUID) {
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["uid"] === UUID) return userData[i];
            }
        }

        let cur = findUser(uid);

        // Render profile page
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

        // TODO: Replace with formal database operation
        let userData;
        try {
            userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            globalUserData = userData;
        } catch (e) {
            userData = globalUserData;
        }

        // TODO: Replace this with formal database operation
        function findUser(UUID) {
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["uid"] === UUID) return i;
            }
        }

        let curIndex = findUser(uid);

        userData[curIndex]["realname"] = req.body["realname"].replace(/\</g, "&lt;")
            .replace(/\>/g, "&gt;");
        userData[curIndex]["name"] = req.body["name"].replace(/\</g, "&lt;")
            .replace(/\>/g, "&gt;");
        fs.writeFileSync(config["userData"], JSON.stringify(userData));

        let cur = userData[curIndex];

        // Render success page
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

        // TODO: Replace with formal database operation
        let userData;
        try {
            userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            globalUserData = userData;
        } catch (e) {
            userData = globalUserData;
        }

        // TODO: Replace this with formal database operation
        function findUser(UUID) {
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["uid"] === UUID) return userData[i];
            }
        }

        let cur = findUser(uid);

        res.render(config["uiRoot"] + "/user/.ui/settings.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: false
        });
    });

    app.post("/user/settings", (req, res) => {
        let uid = req.session.userID;

        // TODO: Replace with formal database operation
        let userData;
        try {
            userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
            globalUserData = userData;
        } catch (e) {
            userData = globalUserData;
        }

        // TODO: Replace this with formal database operation
        function findUser(UUID) {
            for (let i = 0; i < userData.length; i++) {
                if (userData[i]["uid"] === UUID) return i;
            }
        }

        let curIndex = findUser(uid);

        userData[curIndex]["default-compiler"] = req.body["compiler"];
        fs.writeFileSync(config["userData"], JSON.stringify(userData));

        let cur = userData[curIndex];
        res.render(config["uiRoot"] + "/user/.ui/settings.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: true
        });
    });
};