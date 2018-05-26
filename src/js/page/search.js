define([
    'jquery',
    "template"
], function($, template) {
    var storage = window.localStorage;
    var searchArr = JSON.parse(storage.getItem('searcharr')) || [];
    //[{"ad_name":"西游"}]
    //初始显示标签
    $.getJSON("/book/searchkey", function(d) {
        //{ads:[{"ad_name":"jia'r",status:1},{"ad_name":"jia'r"},{"ad_name":"jia'r"},{"ad_name":"jia'r"}]}
        var newsearch = d.ads.concat(searchArr);
        d.ads = newsearch;
        template($('.searchtext').html(), d, ".searchresult");
    });
    //点击搜索
    $('.search-btn').on('click', function() {
        var val = $.trim($(this).prev().val());
        $.ajax({
            url: "/book/search",
            data: {
                title: val,
            },
            dataType: "json",
            success: function(d) {
                var arr = d.items.filter(function(v, i) {
                    return new RegExp(val, "g").test(v.title);
                });
                if (arr.length) {
                    searchArr.push({
                        ad_name: val
                    });
                    storage.setItem('searcharr', JSON.stringify(searchArr));
                };
                $(".searchresult").html('');
                template($('.searchlist').html(), {
                    items: arr
                }, ".searchresult");
            }
        })
    });

});