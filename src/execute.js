/*
 * Execute two programs and hold a match
 */

let events = require("events");
let {spawn} = require("child_process");
let Game = require("./game.js").Game;

function Match() {
    this.events = new events.EventEmitter();
    this.record = [];
    this.game = new Game();
}

Match.prototype.setExecutable = function(A, B) {
    this.binA = A;
    this.binB = B;
    this.procA = spawn(this.binA);
    this.procB = spawn(this.binB);

    this.procA.stdin.write("1\n");
    this.procB.stdin.write("0\n");

    this.procA.stdin.write([this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n");
    this.procA.stdin.write([this.game.snakeA.data[0].x.toString(), this.game.snakeA.data[0].y.toString()].join(" ") + "\n");
    this.procA.stdin.write([this.game.snakeB.data[0].x.toString(), this.game.snake.data[0].y.toString()].join(" ") + "\n");

    this.procB.stdin.write([this.game.food.x.toString(), this.game.food.y.toString()].join(" ") + "\n");
    this.procB.stdin.write([this.game.snakeB.data[0].x.toString(), this.game.snakeB.data[0].y.toString()].join(" ") + "\n");
    this.procB.stdin.write([this.game.snakeA.data[0].x.toString(), this.game.snakeA.data[0].y.toString()].join(" ") + "\n");
};

Match.prototype.execute = function(callback) {
    let errors = [];
    let fnProcA, fnProcB;
    fnProcA = (data) => {
        if(!isFinite(data)) { // Error in A, B wins
            this.record.push({user:1, operation:data, valid:false});
            errors.push({player:1, msg:"Unexpected output!"});
            this.procA.terminate();
            this.procB.terminate();
            callback({winner:2, error:errors});
            return;
        }
        let opA = data.parseInt();
        if((opA < 0) || (opA > 3)) {
            this.record.push({user:1, operation:data, valid:false});
            errors.push({player:1, msg:"Unexpected output!"});
            this.procA.terminate();
            this.procB.terminate();
            callback({winner:2, error:errors});
            return;
        }
        status = this.game.makeTurn("A", opA);
        this.record.push({user:1, operation:data, valid:true, food: [this.game.food.x, this.game.food.y]});
        if(!status) { // A loses
            this.procA.terminate();
            this.procB.terminate();
            callback({winner:2, error:errors});
            return;
        }
        this.procB.once("data", fnProcB);
    };
    fnProcB = (data) => {
        if(!isFinite(data)) { // Error in A, B wins
            this.record.push({user:2, operation:data, valid:false});
            errors.push({player:2, msg:"Unexpected output!"});
            this.procA.terminate();
            this.procB.terminate();
            callback({winner:1, error:errors});
            return;
        }
        let opB = data.parseInt();
        if((opB < 0) || (opB > 3)) {
            this.record.push({user:2, operation:data, valid:false});
            errors.push({player:2, msg:"Unexpected output!"});
            this.procA.terminate();
            this.procB.terminate();
            callback({winner:1, error:errors});
            return;
        }
        this.record.push({user:2, operation:data, valid:true, food: [this.game.food.x, this.game.food.y]});
        status = this.game.makeTurn("B", opB);
        if(!status) { // B loses
            this.procA.terminate();
            this.procB.terminate();
            callback({winner:1, error:errors});
            return;
        }
        this.procA.once("data", fnProcA);
    };
    this.procA.stdout.once("data", fnProcA);
};

exports.Match = Match;