/*
 * A simple realization of an 2D vector
 */

function Vector(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(another) {
    return new Vector(this.x+another.x, this.y+another.y);
};

exports.Vector = Vector;