prepare = function (document, $, submissionId) {
    var errCodeList = [
        {text: "Effective", style: "effective"},
        {text: "Inactive", style: "inactive"},
        {text: "Compile Error", style: "ce"},
    ];

    $.get("/getSubmissionDetail?id=" + submissionId, function (data) {
        var JSONData = JSON.parse(data);
        $(".submission-status--icon").addClass(errCodeList[JSONData["status"]].style);
        $(".submission-status--text").addClass(errCodeList[JSONData["status"]].style).html(errCodeList[JSONData["status"]].text);
        $(".time").html(JSONData["time"]);
        $("#compiler").html("compiler");
        console.log(JSONData["errorMsg"]);
        if (JSONData["status"] === 2) {
            $("#errorMsg").html(JSONData["errorMsg"]);
        }
    });
};