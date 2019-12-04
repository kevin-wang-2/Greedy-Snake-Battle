function Vector(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(another) {
    return new Vector(this.x+another.x, this.y+another.y);
};

function Queue() {
    this.data = [];
}

Queue.prototype.enqueue = Queue.prototype.push = function(data) {
    this.data.push(data);
};

Queue.prototype.dequeue = function() {
    return this.data.shift()
};

Queue.prototype.size = Queue.prototype.getLength = function() {
    return this.data.length;
};
Queue.prototype.last = function() {
    return this.data[this.getLength() - 1];
};

Queue.prototype.indexOf = function(elt) {
    for(let i=0;i<this.size();i++)
        if(this.data[i].x === elt.x && this.data[i].y === elt.y) return i;
    return -1;
};

const opValue = [new Vector(-1, 0), new Vector(0, -1), new Vector(1, 0), new Vector(0, 1)];

function Game(borderX = 50, borderY = 50) {
    this.borderX = borderX;
    this.borderY = borderY;
    this.snakeA = new Queue();
    this.snakeB = new Queue();
    this.food = new Vector();
}

Game.prototype.makeTurn = function(user, op) {
    var direction = opValue[op];
    var newTail;
    if(user === "A") {
        newTail = this.snakeA.last().add(direction);
        newTail.x %= this.borderX;
        newTail.y %= this.borderY;
        if(newTail.x !== this.food.x || newTail.y !== this.food.y) {
            this.snakeA.dequeue();
        }
        if(this.snakeA.indexOf(newTail) !== -1) return 0;
        this.snakeA.enqueue(newTail);
        return this.snakeB.indexOf(newTail) === -1 && !outOfBorder(this, newTail);
    } else {
        newTail = this.snakeB.last().add(direction);
        newTail.x %= this.borderX;
        newTail.y %= this.borderY;
        if(newTail.x !== this.food.x || newTail.y !== this.food.y) {
            this.snakeB.dequeue();
        }
        if(this.snakeB.indexOf(newTail) !== -1) return 0;
        this.snakeB.enqueue(newTail);
        return this.snakeA.indexOf(newTail) === -1 && !outOfBorder(this, newTail);
    }
};

function outOfBorder(game, vec) {
    return vec.x >= game.borderX || vec.y >= game.borderY || vec.x < 0 || vec.y < 0;
}

prepare = function (document, $, matchId) {
    function generateBoard() {
        for(var y = 0; y < 50; y++) {
            $("table.board-table").append($("<tr></tr>").addClass("line-" + y.toString()));
            for(var x = 0; x < 50; x++) {
                $("tr.line-" + y.toString()).append($("<td></td>").addClass("pos-" + x.toString() + "-" + y.toString()));
            }
        }
    }

    function setCur(snakeA, snakeB, food, A_shift, B_shift) {
        if(A_shift.length !== 0) $("td.pos-" + A_shift.x.toString() + "-" + A_shift.y.toString()).css({backgroundColor: '#ffffff'});
        if(B_shift.length !== 0) $("td.pos-" + B_shift.x.toString() + "-" + B_shift.y.toString()).css({backgroundColor: '#ffffff'});

        for(var i=0;i<snakeA.getLength();i++) {
            $("td.pos-" + snakeA.data[i].x.toString() + "-" + snakeA.data[i].y.toString()).css({backgroundColor: '#c9a26c'});
        }
        for(i=0;i<snakeB.getLength();i++) {
            $("td.pos-" + snakeB.data[i].x.toString() + "-" + snakeB.data[i].y.toString()).css({backgroundColor: '#fb5555'});
        }

        $("td.pos-" + snakeA.data[snakeA.getLength() - 1].x.toString() + "-" + snakeA.data[snakeA.getLength() - 1].y.toString()).css({backgroundColor: '#c9a450'});
        $("td.pos-" + snakeB.data[snakeB.getLength() - 1].x.toString() + "-" + snakeB.data[snakeB.getLength() - 1].y.toString()).css({backgroundColor: '#fd8b4e'});
        $("td.pos-" + food.x.toString() + "-" + food.y.toString()).css({backgroundColor: '#20c997'});
    }
    
    function getPage(page = 1, callback) {
        $.get("/getMatchDetail?page=" + page.toString() + "&match=" + matchId, function (data) {
            if(data !== "[]")
                callback(JSON.parse(data));
        });
    }

    var directionText = ["LEFT", "UP", "RIGHT", "DOWN"];

    function run() {
        var game = new Game();
        getPage(0, function(data) {
            game.snakeA.enqueue(new Vector(data[0]["birthA"][0], data[0]["birthA"][1]));
            game.snakeB.enqueue(new Vector(data[0]["birthB"][0], data[0]["birthB"][1]));
            game.food = new Vector(data[0]["food"][0], data[0]["food"][1]);

            var matchdata = [];
            var page = 1;
            var cb = function (data) {
                matchdata = matchdata.concat(data);
                if(data !== []) getPage(page++, cb);
            };
            getPage(page++, cb);

            var update = function () {
                if(matchdata.length !== 0) {
                    var A_shift = [], B_shift = [];
                    const step = matchdata[0];
                    matchdata.shift();
                    if (step["user"] === 1) {
                        A_shift = game.snakeA.data[0];
                        game.makeTurn("A", step["operation"]);
                        $("#user1op").html(directionText[step["operation"]])
                    } else {
                        B_shift = game.snakeB.data[0];
                        game.makeTurn("B", step["operation"]);
                        $("#user2op").html(directionText[step["operation"]])
                    }
                    game.food = new Vector(step["food"][0], step["food"][1]);
                    setCur(game.snakeA, game.snakeB, game.food, A_shift, B_shift);
                }
            };
            generateBoard();
            var fps = 20;
            var animation = setInterval(update, 1000 / fps);

            $("[name=step-pause]").click(function () {
                if (animation !== 0) {
                    clearInterval(animation);
                    animation = 0;
                    $("[name=step-pause]").html("Go");
                } else {
                    animation = setInterval(update, 1000 / fps);
                    $("[name=step-pause]").html("Pause");
                }
            });

            $("[name=step-go]").click(function () {
                if (isFinite($("[name=step-speed]").val())) {
                    fps = parseInt($("[name=step-speed]").val());
                    if (animation !== 0) {
                        clearInterval(animation);
                        animation = setInterval(update, 1000 / fps);
                    }
                } else {
                    $("[name=step-speed]").val(fps.toString());
                }
            })

        })
    }

    return run;
};