/*
 * A auto-compile tool for student's homework
 */

let exec = require("child_process").exec;

const fs = require("fs");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

let compiler = {
    "c++98": "g++ %source -o %exec -std=c++98 -lm -Werror -Wall %flags",
    "c++11": "g++ %source -o %exec -std=c++11 -lm -Werror -Wall %flags",
    "c++14": "g++ %source -o %exec -std=c++14 -lm -Werror -Wall %flags",
    "c++17": "g++ %source -o %exec -std=c++17 -lm -Werror -Wall %flags"
};

function Compiler(language = "C++17") {
    this.language = language;
    this.sourceList = [];
    this.compileFlags = "";
}

Compiler.prototype.addSource = function (route) {
    this.sourceList.push(route);
    return this;
};

Compiler.prototype.compile = function (execName, callback) {
    let baseCommand = compiler[this.language];
    baseCommand = baseCommand.replace(/%source/, this.sourceList.join(" "));
    baseCommand = baseCommand.replace(/%exec/, config["binRoot"] + execName);
    baseCommand = baseCommand.replace(/%flags/, this.compileFlags);
    exec(baseCommand, (error, stdout, stderr) => {
        if (error) {
            callback({"status": error.code, "stack": error.stack, "stdout": stdout, "stderr": stderr});
        } else if (stderr !== "") {
            callback({"status": -1, "stack": "Compile Error", "stdout": stdout, "stderr": stderr});
        } else {
            callback({"status": 0, "stack": null, "stdout": stdout, "stderr": stderr});
        }
    })
};

exports.Compiler = Compiler;