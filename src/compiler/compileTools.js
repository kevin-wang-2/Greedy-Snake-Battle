/*
 * Output status code:
 * 0 - Effective
 * 1 - Inactive
 * 2 - Compile Error
 */

const Compiler = require("../compiler/compiler.js").Compiler;
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

exports.compile = function (userID, sourcedir, compiler) {
    let curCompileData = {
        userID: userID,
        compiler: compiler,
        time: (new Date()).toLocaleTimeString(),
        source: sourcedir
    };
    let binName = (new Date()).valueOf().toString() + userID.toString();
    (new Compiler(compiler)).addSource(sourcedir + "/lab8.cpp")
        .addSource(sourcedir + "/main.cpp")
        .compile(binName, (msg) => {
            if (msg.errorCode || msg.stderr) {
                curCompileData["status"] = 2;
                curCompileData["error"] = msg;
                curCompileData["bin"] = "binName";
                let submissionData = JSON.parse(fs.readFileSync(config["submissionData"]).toString());
                submissionData.push(curCompileData);
                fs.writeFileSync(config["submissionData"], JSON.stringify(submissionData));
            } else {
                curCompileData["status"] = 0;

                let submissionData = JSON.parse(fs.readFileSync(config["submissionData"]).toString());
                for (let i = 0; i < submissionData.length; i++) {
                    if (submissionData[i]["userID"] === userID && submissionData[i].status === 0) {
                        submissionData[i].status = 1; // Deactivate
                        break;
                    }
                }
                curCompileData["bin"] = binName;
                submissionData.push(curCompileData);
                fs.writeFileSync(config["submissionData"], JSON.stringify(submissionData));

                let userData = JSON.parse(fs.readFileSync(config["userData"]).toString());
                userData[userID]["bin"] = binName;
                fs.writeFileSync(config["userData"], JSON.stringify(userData));
            }
        });
};