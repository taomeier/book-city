define([
    'jquery'
], function($) {
    var tip = "";
    $('.loginbtn').on('click', function() {
        var userName = $.trim($('.text').val()),
            pwd = $.trim($('.pwd').val());
        if (userName === "") {
            tip = "请输入账号";
        } else if (pwd === "") {
            tip = "请输入密码";
        };

        if (tip) {
            $('.tip').html(tip);
        } else {
            var data = {
                user: userName,
                pwd: pwd
            };
            $.ajax({
                url: "/loginuser",
                type: "post",
                data: data,
                dataType: "json",
                success: function(data) {
                    if (data.result == "success") {
                        history.go(-1)
                    } else {
                        $('.tip').html("用户和密码输入错误");
                    }
                }
            })
        }
    });
});