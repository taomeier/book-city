define([
    'jquery', "template", "base64"
], function($, template) {
    var storage = window.localStorage;
    //默认字体大小
    var fontnum = storage.getItem('fontSize') || 16;
    var bookCont = $('.book-cont'),
        bookMask = $('.book-mask'),
        menuDialog = $('.menu-dialog');
    //console.log(fontnum);
    bookCont.css('font-size', fontnum + 'px');
    //当前章数
    var initNum = storage.getItem('chapter_id') || 1;
    var menuData = null;
    //获取总章数
    $.ajax({
        url: "/book/menu-list",
        dataType: "json",
        async: false,
        success: function(data) {
            //总章数
            menuData = data.item.toc;
        }
    })

    getArticleUrl();
    //第一章的数据
    function getArticleUrl() {
        storage.setItem('chapter_id', initNum);
        $.ajax({
            url: "/book/reader-list?article=" + initNum,
            dataType: "json",
            success: function(data) {
                var jsonpUrl = data.jsonp;
                getArticleData(jsonpUrl);
            }
        });
    }

    function getArticleData(url) {
        var script = document.createElement('script');
        script.src = url;
        window["duokan_fiction_chapter"] = function(data) {
            var data = JSON.parse($.base64().decode(data));
            //重新渲染阅读界面
            $('.book-cont').empty();
            template($('.readCont').html(), data, '.book-cont');
            //修改当前章节
            var sumNum = menuData.length;
            $('.f_top_num').html(initNum + "/" + sumNum);
            document.head.removeChild(script);
        }
        document.head.appendChild(script);
    }
    //点击出现遮罩层

    bookCont.on('click', function() {
        bookMask.show();
    });
    bookMask.on('click', function() {
        bookMask.hide();
    });
    //点击目录
    $('.menu-btn').on('click', function(e) {
        e.stopPropagation();
        template($('.menulist').html(), {
            list: menuData
        }, ".menu-dialog ul");
        menuDialog.addClass('show');
    });
    //点击每个li切换阅读界面
    $('.menu-dialog').on('click', "li", function() {
        initNum = $(this).data('id');
        getArticleUrl();
        menuDialog.removeClass('show');
    });
    //上一章下一章
    $('.prev-btn').on('click', function(e) {
        e.stopPropagation();
        initNum--;
        if (initNum <= 0) {
            return false;
        }
        getArticleUrl();
    });
    $('.next-btn').on('click', function(e) {
        e.stopPropagation();
        initNum++;
        if (initNum > menuData.length) {
            return false;
        }
        getArticleUrl();
    });
    //点击返回
    $('.back').on('click', function() {
        $(".menu-dialog ul").empty();
        menuDialog.removeClass('show');
    });

    //点击字体
    $('.font-btn').on('click', function(e) {
        e.stopPropagation();
        $('.font-dialog').show();
    });

    $('.big-btn').on('click', function(e) {
        e.stopPropagation();
        fontSize(+2);
    });

    $('.samll-btn').on('click', function(e) {
        e.stopPropagation();
        fontSize(-2);
    });

    function fontSize(num) {
        var fontsize = parseInt(bookCont.css('font-size'));
        bookCont.css("font-size", fontsize + num);
        storage.setItem('fontSize', fontsize + num);
    }
});