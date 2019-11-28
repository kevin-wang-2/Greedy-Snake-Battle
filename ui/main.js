(function (document, $) {
    $(document).ready(function () {
        const trTemplate = "<tr>\n" +
            "                                    <td class=\"col--rank\">#${rank}</td>\n" +
            "                                    <td class=\"col--user\">\n" +
            "                                            <span class=\"player\" style=\"color:red;font-weight:bold;\">${username}</span>\n" +
            "                                    </td>\n" +
            "                                    <td class=\"col--score\">\n" +
            "                                          <span class=\"rating\" style=\"color:red;font-weight:bold;\">\n" +
            "                                            ${score}\n" +
            "                                          </span>\n" +
            "                                    </td>\n" +
            "                                    <td class=\"col--wins\">${win}</td>\n" +
            "                                    <td class=\"col--loses\">${lose}</td>\n" +
            "                                    <td class=\"col--draws\">${draw}</td>\n" +
            "                                </tr>";
        var update = function () {
            $.get("getScoreBoard", function (data) {
                $("#datagrid").html("");
                if (!data) return;
                var jsonData = JSON.parse(data);
                for (var i = 0; i < jsonData.length; i++) {
                    var cur = trTemplate.replace("${rank}", i + 1)
                        .replace("${userid}", jsonData[i]["uid"])
                        .replace("${username}", jsonData[i]["name"])
                        .replace("${score}", jsonData[i]["score"])
                        .replace("${win}", jsonData[i]["win"])
                        .replace("${lose}", jsonData[i]["lose"])
                        .replace("${draw}", jsonData[i]["draw"]);
                    $("#datagrid").html($("#datagrid").html() + cur);
                }
            });
            $("#refreshTime").html((new Date()).toTimeString());
            setTimeout(update, 6000);
        };
        update();
    })
})(document, $);