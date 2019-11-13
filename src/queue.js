/*
 * A Simple realization of Queue in javascript
 */

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

exports.Queue = Queue;