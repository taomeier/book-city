define(function() {
    return function(pathName) {
        var url = location.search.substr(1);
        url = '{"' + url.replace(/=/g, '":"').replace(/&/, '","') + '"}';
        return JSON.parse(url)[pathName];
    }
});