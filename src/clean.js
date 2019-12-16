const exec = require("child_process").exec;

setInterval(() => {
    exec("sh", ["clean.sh"]);
}, 60000);