define([
    'jquery',
    "getUrl",
    "template",
    "text!../tql/detail.html",
    "text!../tql/detail2.html"
], function($, geturl, template, text, text2) {
    var id = geturl('activeid');
    $.getJSON('/book/detail', {
        acitveid: id
    }, function(d) {
        var data = d.author_books[0];
        data.word_count = Math.round(data.word_count / 10000);

        template(text2, d.item, "#wrap");

        $('.folder-cnt').on('click', function() {
            $(this).toggleClass('-fold')
        });

        template(text, data, "#wrap");

        $('.book-dash-text').on('click', function() {
            $.ajax({
                url: '/loginSearch',
                dataType: 'json',
                success: function(data) {
                    if (data.result === 'false') {
                        if (confirm("请先登录")) {
                            location.href = "/page/login.html";
                        }
                    } else {
                        location.href = "/page/read.html?activeid=" + id;
                    }
                }
            })

        });
    })
})