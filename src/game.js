/*
 * The game controlling section of the server
 */

let Queue = require("./queue.js").Queue;
let Vector = require("./vector.js").Vector;

const opValue = [new Vector(-1, 0), new Vector(0, -1), new Vector(1, 0), new Vector(0, 1)];

function Game(borderX = 50, borderY = 50) {
    this.borderX = borderX;
    this.borderY = borderY;
    this.snakeA = new Queue();
    this.snakeB = new Queue();
    // Initialize two snakes
    this.snakeA.push(new Vector(Math.floor(Math.random() * this.borderX / 2 + this.borderX / 2), Math.floor(Math.random() * this.borderY / 2 + this.borderY / 2)));
    this.snakeB.push(new Vector(Math.floor(Math.random() * this.borderX / 2), Math.floor(Math.random() * this.borderY / 2)));
    this.regenerateFood();
}

Game.prototype.regenerateFood = function() {
    this.food = new Vector(Math.floor(Math.random() * this.borderX), Math.floor(Math.random() * this.borderY));
};

Game.prototype.makeTurn = function(user, op) {
    let direction = opValue[op];
    if(user === "A") {
        let newTail = this.snakeA.last().add(direction);
        newTail.x %= this.borderX;
        newTail.y %= this.borderY;
        if(newTail.x !== this.food.x || newTail.y !== this.food.y) {
            this.snakeA.dequeue();
        } else this.regenerateFood();
        if(this.snakeA.indexOf(newTail) !== -1) return 0;
        this.snakeA.enqueue(newTail);
        return this.snakeB.indexOf(newTail) === -1 && !outOfBorder(this, newTail);
    } else {
        let newTail = this.snakeB.last().add(direction);
        newTail.x %= this.borderX;
        newTail.y %= this.borderY;
        if(newTail.x !== this.food.x || newTail.y !== this.food.y) {
            this.snakeB.dequeue();
        } else this.regenerateFood();
        if(this.snakeB.indexOf(newTail) !== -1) return 0;
        this.snakeB.enqueue(newTail);
        return this.snakeA.indexOf(newTail) === -1 && !outOfBorder(this, newTail);
    }
};

function outOfBorder(game, vec) {
    return vec.x >= game.borderX || vec.y >= game.borderY || vec.x < 0 || vec.y < 0;
}

exports.Game = Game;