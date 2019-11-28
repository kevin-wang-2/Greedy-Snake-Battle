(function (document, $) {
    $.get("/oauth/session?key=userID", function (data) {
        if (data !== "[]") {
            $.get("/getUserInfo?userID=" + data, function (data) {
                var jsonData = JSON.parse(data);
                var permissionList = {1: "student", 2: "TA", 3: "admin"};
                $("#signin").find("a").html(jsonData["studentID"] + "\n" +
                    "        (" + jsonData["name"] + ")\n" +
                    "        <span class=\"text-red\">(" + permissionList[jsonData["permission"]] + ")</span>\n")
                    .attr("href", "/user/profile")
                    .removeClass("nav__button")
                    .addClass("nav__item");
            });
        }
    });
    $(document).ready(function () {
        $(".footer").html("\n" +
            "        <div class=\"supplementary\">\n" +
            "            Developed by VG101-FA19 TA Group.\n" +
            "            <br>\n" +
            "            UI and fonts are based on <a href=\"http://focs.ji.sjtu.edu.cn/gomoku/\">GomokuFun portal</a> and <a href=\"https://github.com/vijos/vj4\">vij4 open-source OJ platform</a>.\n" +
            "        </div>");
    })
})(document, $);