const url = require("url");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.setRouter = function (app) {
    app.use('/match/list/', (req, res) => {
        let path = url.parse(req.url).path.split("/");
        if (path.length === 2 || (path.length === 3 && path[path.length - 1] === "")) {
            res.render(config["uiRoot"] + "/match/.ui/list.html");
        } else {

        }
    });
};