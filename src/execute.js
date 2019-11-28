/*
 * Execute two programs and hold a match
 */

let {spawn} = require("child_process");
let Game = require("./game.js").Game;
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("../config/config.json").toString());

function Match() {
    this.record = [];
    this.game = new Game();
    this.roundsLeft = config["maxRounds"];
}

Match.prototype.setExecutable = function(A, B) {
    this.binA = A;
    this.binB = B;
    this.procA = spawn(this.binA, ["-r"]);
    this.procB = spawn(this.binB, ["-r"]);

    this.procA.stdin.on("error", (msg) => {console.log("A:" + msg);});
    this.procB.stdin.on("error", (msg) => {console.log("B:" + msg);});

    this.procA.stdin.write("1\n" + [this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n" +
        [this.game.snakeA.data[0].x.toString(), this.game.snakeA.data[0].y.toString()].join(" ") + "\n" +
        [this.game.snakeB.data[0].x.toString(), this.game.snakeB.data[0].y.toString()].join(" ") + "\n");

    this.procB.stdin.write("0\n" + [this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n" +
        [this.game.snakeB.data[0].x.toString(), this.game.snakeB.data[0].y.toString()].join(" ") + "\n" +
        [this.game.snakeA.data[0].x.toString(), this.game.snakeA.data[0].y.toString()].join(" ") + "\n");

    this.record.push({
        birthA: [this.game.snakeA.data[0].x, this.game.snakeA.data[0].y],
        birthB: [this.game.snakeB.data[0].x, this.game.snakeB.data[0].y],
        food: [this.game.food.x, this.game.food.y]
    });
};

Match.prototype.execute = function(callback) {
    let errors = [];
    let fnProcA, fnProcB;
    fnProcA = (data) => {
        if(/^[0-3]$/.test(data.toString())) { // Error in A, B wins
            this.record.push({user:1, operation:data, valid:false});
            errors.push({player:1, msg:"Unexpected output!"});
            this.procA.kill();
            this.procB.kill();
            callback({winner:2, error:errors});
            return;
        }
        let opA = parseInt(data.toString());
        status = this.game.makeTurn("A", opA);
        if(!status) { // A loses
            this.procA.kill();
            this.procB.kill();
            this.record.push({user:1, operation:opA, valid:false, food: [this.game.food.x, this.game.food.y]});
            callback({winner:2, error:errors});
            return;
        }
        this.record.push({user:1, operation:opA, valid:true, food: [this.game.food.x, this.game.food.y]});
        this.procA.stdin.write([this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n");
        this.procB.stdin.write(opA.toString() + "\n" + [this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n");
        this.procB.stdout.once("data", fnProcB);
    };
    fnProcB = (data) => {
        if((/^[0-3]$/.test(data.toString()))) { // Error in A, B wins
            this.record.push({user:2, operation:data, valid:false});
            errors.push({player:2, msg:"Unexpected output!"});
            this.procA.kill();
            this.procB.kill();
            callback({winner:1, error:errors});
            return;
        }
        let opB = parseInt(data.toString());
        status = this.game.makeTurn("B", opB);
        if(!status) { // B loses
            this.procA.kill();
            this.procB.kill();
            this.record.push({user:2, operation:opB, valid:false, food: [this.game.food.x, this.game.food.y]});
            callback({winner:1, error:errors});
            return;
        }
        this.record.push({user:2, operation:opB, valid:true, food: [this.game.food.x, this.game.food.y]});
        this.roundsLeft--;
        if (this.roundsLeft < 0) {
            this.procA.kill();
            this.procB.kill();
            if (this.game.snakeA.getLength() > this.game.snakeB.getLength())
                callback({winner: 1, error: errors});
            else if (this.game.snakeA.getLength() === this.game.snakeB.getLength())
                callback({winner: 0, error: errors});
            else
                callback({winner: 2, error: errors});
            return;
        }
        this.procB.stdin.write([this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n");
        this.procA.stdin.write(opB.toString() + "\n" + [this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n");
        this.procA.stdout.once("data", fnProcA);
    };
    this.procA.stdout.once("data", fnProcA);
};

exports.Match = Match;