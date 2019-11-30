const fs = require("fs");
const url = require("url");
const execSync = require("child_process").execSync;
const compile = require("../compiler/compileTools.js").compile;

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.setRouter = function (app) {
    app.get("/submission", (req, res) => {
        res.render(config["uiRoot"] + "/submission/.ui/mysubmissions.html");
    });

    app.get("/submission/submit", (req, res) => {
        let uid = req.session.userID;
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let cur = userData[uid];
        res.render(config["uiRoot"] + "/submission/.ui/submit.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: false
        });
    });

    app.post("/submission/submit", (req, res) => {
        if (!req.session.token) {
            res.setHeader(404);
        } else {
            let data = req.body["code"];
            let sourcedir = config["submissionRoot"] + (new Date()).valueOf().toString() + req.session.userID.toString();
            fs.mkdirSync(sourcedir);
            fs.writeFileSync(sourcedir + "/lab8.cpp", data);
            execSync("cp " + config["submissionRoot"] + "template/* " + sourcedir);
            compile(req.session.userID, sourcedir, req.body["compiler"]);
        }

        let uid = req.session.userID;
        let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
        let cur = userData[uid];
        res.render(config["uiRoot"] + "/submission/.ui/submit.html", {
            compiler: cur["default-compiler"],
            token: req.session.token.toString(),
            post: true
        });
    });

    app.use("/submission/check", (req, res) => {
        let path = url.parse(req.url).path.split("/");
        res.render(config["uiRoot"] + "/submission/.ui/check.html", {
            submissionId: parseInt(path[path.length - 1])
        });
    })
};