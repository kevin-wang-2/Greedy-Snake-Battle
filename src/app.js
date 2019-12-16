/*
 * The battling and compiling server of Jigang FA19's Lab8 Greedy Snake
 */

const app = require("./httpServer.js").app;
const execSync = require("child_process").execSync;

(function begin() {
    app.listen(8000);

    setInterval(() => {
        execSync("sh", ["clean.sh"]);
    }, 60000);
})();
