/*
  Generated by kissy-xtemplate.*/
KISSY.add('test/t-xtpl', function () {
    return function (scopes, S, undefined) {
        var buffer = "",
            config = this.config,
            engine = this,
            utils = config.utils;
        var runBlockCommandUtil = utils["runBlockCommand"],
            getExpressionUtil = utils["getExpression"],
            getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
        buffer += '<div>\r\n\txx\r\n\t\\s\r\n\t';
        var config1 = {};
        var params2 = [];
        params2.push('z');
        config1.params = params2;
        var id0 = getPropertyOrRunCommandUtil(engine, scopes, config1, "include", 0, 4, true, undefined);
        buffer += id0;
        buffer += '\r\n\t';
        var id3 = getPropertyOrRunCommandUtil(engine, scopes, {}, "x", 0, 5, undefined, false);
        buffer += getExpressionUtil(id3, true);
        buffer += '\r\n     ';
        buffer += getExpressionUtil(('2 \\') + (2), true);
        buffer += '\r\n\r\n     ';
        buffer += getExpressionUtil(('1 \\') + (3), true);
        buffer += '\r\n</div>';
        return buffer;
    }
});