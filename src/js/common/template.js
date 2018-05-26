define(["jquery", 'handlebars'], function($, hand) {
    var sethtml = function(text, data, parent) {
        var fun = hand.compile(text);
        hand.registerHelper("iflength", function(items, options) {
            return options.fn(items.splice(0, 5));
        });
        $(parent).append(fun(data));
    };
    return sethtml;
});