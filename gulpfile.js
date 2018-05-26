var gulp = require('gulp');
var less = require('gulp-less');
var squence = require('gulp-sequence');
var server = require('gulp-webserver');
var mock = require('./src/data/mock.js');
var mincss = require("gulp-clean-css");
var es5js = require('gulp-babel');
var minjs = require("gulp-uglify");
var htmlMin = require("gulp-htmlmin")
var user = {
    name: "zs",
    pwd: 1234
};
var userCheck = false;
var url = require('url');
gulp.task('testless', function() {
    gulp.src('./src/css/*.less')
        .pipe(less())
        .pipe(mincss())
        .pipe(gulp.dest("dist/css"))
});
// gulp.task('change', function() {
//     gulp.watch("./src/css/*.less", ["testless"])
// });
// gulp.task("testjs", function() {
//     gulp.src("./src/js/{common/,lib/,page/}*.js")
//         .pipe(es5js({
//             presets: "es2015"
//         }))
//         .pipe(gule.dest("dist/js"))
// });
// gulp.task("testhtml", function() {
//     gulp.src("./src/*.html")
//         .pipe(es5js())
//         .pipe(gule.dest("dist"))
// });
gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 8008,
            host: "localhost",
            // livereload: true,
            // open: true,
            middleware: function(req, res, next) {
                var uname = url.parse(req.url, true);
                if (req.url === "/loginuser") {
                    var arr = [];
                    req.on('data', function(chunk) {
                        arr.push(chunk);
                    });
                    req.on('end', function() {
                        var data = Buffer.concat(arr).toString();
                        var obj = require('querystring').parse(data);
                        res.writeHead(200, { 'Content-Type': 'text/javascript;charset=UTF-8' });
                        console.log(obj);
                        if (obj.user === user.name && obj.pwd == user.pwd) {
                            res.end('{"result":"success"}');
                            userCheck = true;
                        } else {
                            res.end('{"result":"error"}');
                        }
                        next();
                    });
                    return false;
                };
                if (req.url === '/loginSearch') {
                    res.end('{"result":"' + userCheck + '"}')
                }
                if (/\/book/g.test(uname.pathname)) {
                    res.end(JSON.stringify(mock(req.url)));
                };
                next();
            }
        }))
});
gulp.task('default', function(cd) {
        squence("testless", "server", cd)
    })
    // gulp.task("default", "testjs")
    // gulp.task("default", "testhtml")