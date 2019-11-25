/*
 * CSRF Generation and management
 * Token is generated by hashing a certain Jaccount Token
 */

let crypto = require("crypto");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

function sha512(password, salt) {
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    let value = hash.digest("hex");
    return {
        salt: salt,
        passwordHash: value
    }
}

function CreateJar() {
    this.Jar = [];
}

CreateJar.prototype.generate = function (base) {
    let cur = sha512(config["CSRFKey"], base);
    this.Jar.push(cur);
};

CreateJar.prototype.validate = function (key) {
    for (let i = 0; i < this.Jar.length; i++) {
        if (this.Jar[i] === key) {
            this.Jar.splice(0, i);
            return true;
        }
    }
    return false;
};

Jar = new CreateJar();

exports.generate = Jar.generate;
exports.validate = Jar.validate;