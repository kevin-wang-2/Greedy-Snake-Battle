prepare = function (document, $, page) {
    var trtemplate = "<tr>\n" +
        "<td class='col--status match-status--border pending'>\n" +
        "    <span class=\"icon match-status--icon ${status_style}\"></span>\n" +
        "    <a href=\"/match/${matchid}\" class=\"match-status--text ${status_style}\">\n" +
        "       ${status}\n" +
        "    </a>\n" +
        "  </td>\n" +
        "  <td class=\"col--challenger\">\n" +
        "      \n" +
        "      <span class=\"player\" style=\"color:darkorange;font-weight:bold;\">\n" +
        "        <span>${user1_name}</span>\n" +
        "      </span>\n" +
        "  </td>\n" +
        "  <td class=\"col--rating\">\n" +
        "    \n" +
        "      <span class=\"rating\" style=\"color:darkorange;font-weight:bold;\">\n" +
        "        ${user1_rating}\n" +
        "      </span>\n" +
        "  </td>\n" +
        "  <td class=\"col--challengee\">\n" +
        "      \n" +
        "      <span class=\"player\" style=\"color:red;font-weight:bold;\">\n" +
        "        ${user2_name}\n" +
        "      </span>\n" +
        "    \n" +
        "  </td>\n" +
        "  <td class=\"col--rating\">\n" +
        "    \n" +
        "      <span class=\"rating\" style=\"color:red;font-weight:bold;\">\n" +
        "        ${user2_rating}\n" +
        "      </span>\n" +
        "  </td>\n" +
        "</tr>";

    var errCodeList = [
        {style: "draw", text: "Draw"},
        {style: "u1win", text: "Challenger Win"},
        {style: "u2win", text: "Opponent Win"}
    ];

    $.get("/getMatchList?page=" + page.toString(), function (data) {
        var JSONData = JSON.parse(data);
        for (var i = 0; i < JSONData.length; i++) {
            var cur = trtemplate.replace(/\${status_style}/g, errCodeList[parseInt(JSONData[i]["status"])]["style"])
                .replace(/\${matchid}/g, JSONData[i]["matchid"])
                .replace(/\${status}/g, errCodeList[parseInt(JSONData[i]["status"])]["text"])
                .replace(/\${user1_id}/g, JSONData[i]["user1"]["id"])
                .replace(/\${user2_id}/g, JSONData[i]["user2"]["id"])
                .replace(/\${user1_name}/g, JSONData[i]["user1"]["name"])
                .replace(/\${user2_name}/g, JSONData[i]["user2"]["name"])
                .replace(/\${user1_rating}/g, JSONData[i]["user1"]["rating"])
                .replace(/\${user2_rating}/g, JSONData[i]["user2"]["rating"]);
            $("#datagrid").html($("#datagrid").html() + cur);
        }
    });

    $(document).ready(function () {
            var filter_on = false;
            $("#filter").click(function () {
                if (!filter_on) {
                    $.get("/getMatchList?filter=1&page=1", function (data) {
                        $("#datagrid").html("");
                        var JSONData = JSON.parse(data);
                        for (var i = 0; i < JSONData.length; i++) {
                            var cur = trtemplate.replace(/\${status_style}/g, errCodeList[parseInt(JSONData[i]["status"])]["style"])
                                .replace(/\${matchid}/g, JSONData[i]["matchid"])
                                .replace(/\${status}/g, errCodeList[parseInt(JSONData[i]["status"])]["text"])
                                .replace(/\${user1_id}/g, JSONData[i]["user1"]["id"])
                                .replace(/\${user2_id}/g, JSONData[i]["user2"]["id"])
                                .replace(/\${user1_name}/g, JSONData[i]["user1"]["name"])
                                .replace(/\${user2_name}/g, JSONData[i]["user2"]["name"])
                                .replace(/\${user1_rating}/g, JSONData[i]["user1"]["rating"])
                                .replace(/\${user2_rating}/g, JSONData[i]["user2"]["rating"]);
                            $("#datagrid").html($("#datagrid").html() + cur);
                        }
                    });
                    $.get("/resetPager?filter=1", function (data) {
                        $(".pager").html(data);
                    });
                    filter_on = true;
                } else {
                    $.get("/getMatchList?page=1", function (data) {
                        $("#datagrid").html("");
                        var JSONData = JSON.parse(data);
                        for (var i = 0; i < JSONData.length; i++) {
                            var cur = trtemplate.replace(/\${status_style}/g, errCodeList[parseInt(JSONData[i]["status"])]["style"])
                                .replace(/\${matchid}/g, JSONData[i]["matchid"])
                                .replace(/\${status}/g, errCodeList[parseInt(JSONData[i]["status"])]["text"])
                                .replace(/\${user1_id}/g, JSONData[i]["user1"]["id"])
                                .replace(/\${user2_id}/g, JSONData[i]["user2"]["id"])
                                .replace(/\${user1_name}/g, JSONData[i]["user1"]["name"])
                                .replace(/\${user2_name}/g, JSONData[i]["user2"]["name"])
                                .replace(/\${user1_rating}/g, JSONData[i]["user1"]["rating"])
                                .replace(/\${user2_rating}/g, JSONData[i]["user2"]["rating"]);
                            $("#datagrid").html($("#datagrid").html() + cur);
                        }
                    });
                    $.get("/resetPager", function (data) {
                        $(".pager").html(data);
                    });
                    filter_on = false;
                }
            })
        }
    )
};