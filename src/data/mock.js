var homeData = require('./home/home.json');
var list1 = require('./home/recommend1.json');
var list2 = require('./home/recommend2.json');
var list3 = require('./home/recommend3.json');
var searchData = require('./search/search.json');
var searchKeyData = require('./search/searchKey.json');
var detail = require('./detail/352876.json');
var read1 = require('./reader/data1.json');
var read2 = require('./reader/data2.json');
var read3 = require('./reader/data3.json');
var read4 = require('./reader/data4.json');
var menulist = require('./reader/chapter-list.json');

var mockdata = {
    "/book/index": homeData,
    "/book/searchkey": searchKeyData,
    "/book/search": searchData,
    "/book/detail?acitveid=352876": detail,
    "/book/list?pagenum=1&limit=10": list1,
    "/book/list?pagenum=2&limit=10": list2,
    "/book/list?pagenum=3&limit=10": list3,
    "/book/reader-list?article=1": read1,
    "/book/reader-list?article=2": read2,
    "/book/reader-list?article=3": read3,
    "/book/reader-list?article=4": read4,
    "/book/menu-list": menulist
};

module.exports = function(url) {
    if (/\/book\/search\?/.test(url)) {
        url = '/book/search';
    }
    return mockdata[url];
}