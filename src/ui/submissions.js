const fs = require("fs");
const url = require("url");
const crypto = require('crypto');
const execSync = require("child_process").execSync;
const compile = require("../compiler/compileTools.js").compile;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

let globalUserData = [];

exports.setRouter = function (app) {
    app.get("/submission", (req, res) => {
        res.render(config["uiRoot"] + "/submission/.ui/mysubmissions.html");
    });

    app.get("/submission/submit", (req, res) => {
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

        res.render(config["uiRoot"] + "/submission/.ui/submit.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: false,
            late: false
        });
    });

    app.post("/submission/submit", (req, res) => {
        if (!req.session.token) {
            res.status(404);
            return;
        }

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

        // Set when submission is closed
        let params = JSON.parse(fs.readFileSync("../config/params.json").toString());
        if (params["closed"]) {
            res.render(config["uiRoot"] + "/submission/.ui/submit.html", {
                compiler: cur["default-compiler"],
                token: req.session.token.toString(),
                post: true,
                late: true
            });
            return;
        }

        // Start compilation
        let sha1 = crypto.createHash("sha1");
        let data = req.body["code"];
        let sourcedir = config["submissionRoot"] + sha1.update((new Date()).valueOf().toString() + req.session.userID.toString()).digest();
        // Copy directory
        fs.mkdirSync(sourcedir);
        fs.writeFileSync(sourcedir + "/lab8.cpp", data);
        execSync("cp " + config["submissionRoot"] + "template/* " + sourcedir);
        compile(req.session.userID, sourcedir, req.body["compiler"]);

        // Render sucess Page
        res.render(config["uiRoot"] + "/submission/.ui/submit.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: true,
            late: false
        });
    });

    app.use("/submission/check", (req, res) => {
        let path = url.parse(req.url).path.split("/");
        res.render(config["uiRoot"] + "/submission/.ui/check.html", {
            submissionId: parseInt(path[path.length - 1])
        });
    })
};