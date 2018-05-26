define([
    'jquery',
    'template',
    "swiper",
    "text!../../tql/tab1.html",
    "bscroll",
    "text!../../tql/homelist.html",
    "lazyload"
], function($, template, swiper, tab1, BScroll, list) {
    // console.log($.fn.lazyload);
    $.getJSON("/book/index", function(d) {
        initHtml(d); //初始化页面大体结构 banner轮播
        //main
        var mainswiper = new swiper('.main', {
            on: {
                slideChangeTransitionStart: function() {
                    var index = this.activeIndex;
                    $('.header>span').eq(index).addClass('active').siblings().removeClass('active');
                }
            }
        });
        $('.header>span').on('click', function() {
            mainswiper.slideTo($(this).index());
        });
        var bscroll = new BScroll('#tab1', {
            scrollbar: true,
            probeType: 2,
            click: true
        });
        var parent = $('.content');
        var pagenum = 1;
        var defaultTip = "上拉加载更多...";
        var tip = "释放加载更多";

        //上拉加载
        bscroll.on('scroll', function() {
            if (pagenum > 3) {
                parent.attr('data-up', "暂无更多数据");
                return false;
            }
            if (this.y < this.maxScrollY - 40) {
                parent.attr('data-up', tip);
            } else if (this.y < this.maxScrollY - 20) {
                parent.attr('data-up', defaultTip);
            }
        })
        bscroll.on('scrollEnd', function() {
            parent.attr('data-up', defaultTip);
        });
        bscroll.on('touchEnd', function() {
            if (pagenum > 3) {
                parent.attr('data-up', "暂无更多数据");
                return false;
            }
            if (parent.attr('data-up') === tip) {
                $.getJSON("/book/list", {
                    pagenum: pagenum,
                    limit: 10
                }, function(d) {
                    template(list, d, "#tab1>div");
                    //图片懒加载
                    $("img.lazy").lazyload({
                        effect: "fadeIn",
                        placeholder: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526638949720&di=51e9be613a4cb19216f71510e5c2d19e&imgtype=0&src=http%3A%2F%2Fwenwen.soso.com%2Fp%2F20130217%2F20130217131500-876204878.jpg",
                        failurelimit: 100,
                        container: ".content"
                    });
                    bscroll.refresh();
                });
                pagenum++;
            }
        });
    });

    function initHtml(d) {
        console.log(d);
        var obj = {};
        d.items.map(function(v, i) {
            obj["data" + i] = v;
        });
        template(tab1, obj, "#tab1>div"); //up-list
        //女生最爱的数据
        var grildata = {
            items: d.items[3].data.data.splice(0, 5)
        };
        template(list, grildata, ".girl-love");
        //男生最爱的数据
        var grildata = {
            items: d.items[4].data.data.splice(0, 5)
        };
        template(list, grildata, ".boy-love");
        //banner
        new swiper(".index-banner", {
            loop: true,
            autoplay: {
                delay: 1000
            }
        });
        //书架
        template(list, grildata, ".book-table");
        new BScroll('.book-page', {
            click: true
        });
        //切换书架样式
        $('.page-btn').on('click', function() {
            if ($(this).hasClass('show')) {
                $(this).removeClass('show');
                $('.book-table').addClass('show');
            } else {
                $(this).addClass('show');
                $('.book-table').removeClass('show');
            }
        });
        //图片懒加载
        $("img.lazy").lazyload({
            effect: "fadeIn",
            placeholder: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526638949720&di=51e9be613a4cb19216f71510e5c2d19e&imgtype=0&src=http%3A%2F%2Fwenwen.soso.com%2Fp%2F20130217%2F20130217131500-876204878.jpg",
            failurelimit: 100,
            container: ".content"
        });
        $("img.lazy").lazyload({
            effect: "fadeIn",
            placeholder: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526638949720&di=51e9be613a4cb19216f71510e5c2d19e&imgtype=0&src=http%3A%2F%2Fwenwen.soso.com%2Fp%2F20130217%2F20130217131500-876204878.jpg",
            failurelimit: 100,
            container: ".book-table"
        });
    }
});