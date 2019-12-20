(function (document, $) {
    $(document).ready(function () {
        $("p.warn").hide();
        $("[name=confirm]").change(function () {
            if ($("[name=confirm]").val() !== $("[name=password]").val()) $("p.warn").show();
            else $("p.warn").hide();
        });
        $("form").submit(function (event) {
            if ($("[name=confirm]").val() !== $("[name=password]").val()) {
                event.preventDefault();
            }
        })
    });
})(document, $);