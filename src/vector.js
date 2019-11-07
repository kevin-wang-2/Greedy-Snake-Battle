/*
 * A simple realization of an 2D vector
 */

function Vector(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.add = (another) => {
        return new Vector(this.x+another.x, this.y+another.y);
    };
    this.toString = () => {
        return {"x": this.x, "y": this.y}.toString();
    }
}

exports.Vector = Vector;