/*
 * The battling and compiling server of Jigang FA19's Lab8 Greedy Snake
 */

const app = require("./httpServer.js").app;
const exec = require("child_process").exec;

(function begin() {
    app.listen(8000);

    setInterval(() => {
        exec("sh", ["clean.sh"]);
    }, 60000);
})();
