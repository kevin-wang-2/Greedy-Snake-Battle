/*
 * The game controlling section of the server
 */

let Queue = require("./queue.js").Queue;
let Vector = require("./vector.js").Vector;

const opValue = [Vector(-1, 0), Vector(0, -1), Vector(1, 0), Vector(0, 1)];

export function Game(borderX = 50, borderY = 50) {
    this.borderX = borderX;
    this.borderY = borderY;
    this.snakeA = new Queue();
    this.snakeB = new Queue();
    // Initialize two snakes
    this.snakeA.push(Vector(Math.random() * this.borderX / 2 + this.borderX / 2, Math.random() * this.borderY / 2 + this.borderY / 2));
    this.snakeB.push(Vector(Math.random() * this.borderX / 2, Math.random() * this.borderY / 2));
    this.food = this.regenerateFood();
}

Game.prototype.regenerateFood = () => {
    this.food = new Vector(Math.random() * this.borderX, Math.random() * this.borderY);
};

Game.prototype.makeTurn = (user, op) => {
    let direction = opValue[op];
    if(user === "A") {
        let newTail = this.snakeA.last() + direction;
        newTail.x %= this.borderX;
        newTail.y %= this.borderY;
        if(newTail.x !== this.food.x || newTail.y !== this.food.y) {
            this.snakeA.pop();
        } else this.food = this.regenerateFood();
        return this.snakeB.indexOf(newTail) === -1;
    } else {
        let newTail = this.snakeB.last() + direction;
        newTail.x %= this.borderX;
        newTail.y %= this.borderY;
        if(newTail.x !== this.food.x || newTail.y !== this.food.y) {
            this.snakeB.pop();
        } else this.food = this.regenerateFood();
        return this.snakeA.indexOf(newTail) === -1;
    }
};

exports.Game = Game;