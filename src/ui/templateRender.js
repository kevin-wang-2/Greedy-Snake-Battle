exports.generatePager = function (pageCnt, curPage, baseLink) {
    let ret = "";
    if (curPage !== 1) { // First and Prev
        ret += "<li>\n" +
            "    <a class=\"pager__item first link\" href=\"/" + baseLink + "/1\">« First</a>\n" +
            "  </li>" +
            "<li>\n" +
            "    <a class=\"pager__item previous link\" href=\"/" + baseLink + "/" + (curPage - 1).toString() + "\">‹ Previous</a>\n" +
            "  </li>";
    }
    if (pageCnt <= 5) {
        for (let i = 1; i <= pageCnt; i++) {
            ret += "<li>\n" +
                "    <a class=\"pager__item " + ((curPage === i) ? "current" : "page link") + "\" href=\"/" + baseLink + "/" + i.toString() + "\">" + i.toString() + "</a>\n" +
                "  </li>";
        }
    } else {
        if (curPage < 5) {
            for (let i = 1; i <= 5; i++) {
                ret += "<li>\n" +
                    "    <a class=\"pager__item " + ((curPage === i) ? "current" : "page link") + "\" href=\"/" + baseLink + "/" + i.toString() + "\">" + i.toString() + "</a>\n" +
                    "  </li>";
            }
            ret += "<li>\n" +
                "    <span class=\"pager__item ellipsis\">...</span>\n" +
                "  </li>";
        } else if (pageCnt - curPage < 4) {
            ret += "<li>\n" +
                "    <span class=\"pager__item ellipsis\">...</span>\n" +
                "  </li>";
            for (let i = pageCnt - 5; i <= pageCnt; i++) {
                ret += "<li>\n" +
                    "    <a class=\"pager__item " + ((curPage === i) ? "current" : "page link") + "\" href=\"/" + baseLink + "/" + i.toString() + "\">" + i.toString() + "</a>\n" +
                    "  </li>";
            }
        } else {
            ret += "<li>\n" +
                "    <span class=\"pager__item ellipsis\">...</span>\n" +
                "  </li>";
            for (let i = curPage - 2; i <= curPage + 2; i++) {
                ret += "<li>\n" +
                    "    <a class=\"pager__item " + ((curPage === i) ? "current" : "page link") + "\" href=\"/" + baseLink + "/" + i.toString() + "\">" + i.toString() + "</a>\n" +
                    "  </li>";
            }
            ret += "<li>\n" +
                "    <span class=\"pager__item ellipsis\">...</span>\n" +
                "  </li>";
        }
    }
    if (curPage !== pageCnt) { // First and Prev
        ret += "<li>\n" +
            "    <a class=\"pager__item next link\" href=\"" + baseLink + "/" + (curPage + 1).toString() + "\">Next ›</a>\n" +
            "  </li>" +
            "<li>\n" +
            "    <a class=\"pager__item last link\" href=\"" + baseLink + "/" + pageCnt.toString() + "\">Last »</a>\n" +
            "  </li>"
    }

    return ret;
};