function filter(list, fn) {
    let newlist = [];
    for(let i=0;i<list.length;i++) {
        if(fn({id:i, data:list[i]})) newlist.push({id:i, data:list[i]});
    }
    return newlist;
}

exports.filter = filter;