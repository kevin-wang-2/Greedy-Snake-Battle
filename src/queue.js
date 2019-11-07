/*
 * A Simple realization of Queue in javascript
 */

function Queue() {
    this.data = [];
    this.enqueue = this.push = (data) => {
        this.data.push(data);
    };
    this.dequeue = () => {
        return this.data.shift()
    };
    this.size = this.getLength = () => {
        return this.data.getLength();
    };
    this.last = () => {
        return this.data[this.getLength() - 1];
    };
    this.indexOf = (elt) => {
        for(let i=0;i<this.size();i++)
            if(this.data[i].toString() === elt.toString()) return i;
         return -1;
    }
}

exports.Queue = Queue;