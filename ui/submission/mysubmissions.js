(function (document, $) {
    var trtemplate = "<tr>\n" +
        "      <td class=\"col--status submission-status--border ${status}\">\n" +
        "        <span class=\"icon submission-status--icon ${status}\"></span>\n" +
        "        <a class=\"submission-status--text ${status}\" href=\"/submission/check/${id}\">\n" +
        "          ${status_cap}\n" +
        "        </a>\n" +
        "      </td>\n" +
        "      <td class=\"col--time\">\n" +
        "      <span class=\"time tooltip drop-target drop-abutted drop-abutted-top drop-element-attached-bottom drop-element-attached-center drop-target-attached-top drop-target-attached-center\">${time}</span>\n" +
        "    </td>\n" +
        "      <td class=\"col--by\">\n" +
        "      <span class=\"player tooltip drop-target drop-abutted drop-abutted-top drop-element-attached-bottom drop-element-attached-center drop-target-attached-top drop-target-attached-center\" style=\"color:red;font-weight:bold;\">\n" +
        "        ${username}\n" +
        "      </span>\n" +
        "      </td>\n" +
        "      <td class=\"col--compiler\">${compiler}</td>\n" +
        "    </tr>";

    var errCodeList = [
        {text: "Effective", style: "effective"},
        {text: "Inactive", style: "inactive"},
        {text: "Compile Error", style: "ce"},
    ];

    $.get("/getSubmissionList", function (data) {
        var JSONData = JSON.parse(data);
        for (var i = 0; i < JSONData.length; i++) {
            var cur = trtemplate.replace(/\${status}/g, errCodeList[parseInt(JSONData[i]["status"])]["style"])
                .replace(/\${status_cap}/, errCodeList[parseInt(JSONData[i]["status"])]["text"])
                .replace(/\${time}/, JSONData[i]["time"])
                .replace(/\${username}/, JSONData[i]["username"])
                .replace(/\${compiler}/, JSONData[i]["compiler"])
                .replace(/\${id}/g, JSONData[i]["id"]);
            $("#datagrid").html($("#datagrid").html() + cur);
        }
    });
})(document, $);