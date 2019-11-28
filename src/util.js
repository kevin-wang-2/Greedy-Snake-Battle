function filter(list, fn) {
    let newlist = [];
    for(let i=0;i<list.length;i++) {
        if(fn({id:i, data:list[i]})) newlist.push({id:i, data:list[i]});
    }
    return newlist;
}

function unorderFilter(list, fn) {
    let newlist = [];
    for (let i = 0; i < list.length; i++) {
        if (fn({id: i, data: list[i]})) newlist.push(list[i]);
    }
    return newlist;
}

function mergeSort(arr, key) {
    let len = arr.length;
    if (len < 2) return arr;
    let mid = Math.floor(len / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);

    return merge(mergeSort(left, key), mergeSort(right, key), key);
}

function merge(left, right, key) {
    let result = [];

    while (left.length > 0 && right.length > 0) {
        if (left[0][key] >= right[0][key]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length) result.push(left.shift());
    while (right.length) result.push(right.shift());

    return result;
}

exports.filter = filter;
exports.unorderFilter = unorderFilter;
exports.sort = mergeSort;