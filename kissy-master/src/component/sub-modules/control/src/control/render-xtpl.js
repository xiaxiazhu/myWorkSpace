/*
  Generated by kissy-xtemplate.*/
KISSY.add('component/control/render-xtpl', function () {
    return function (scopes, S, undefined) {
        var buffer = "",
            config = this.config,
            engine = this,
            utils = config.utils;
        var runBlockCommandUtil = utils["runBlockCommand"],
            getExpressionUtil = utils["getExpression"],
            getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
        buffer += '<div id="';
        var id0 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 1, undefined, false);
        buffer += getExpressionUtil(id0, true);
        buffer += '"\r\n class="';
        var config2 = {};
        var params3 = [];
        params3.push('');
        config2.params = params3;
        var id1 = getPropertyOrRunCommandUtil(engine, scopes, config2, "getBaseCssClasses", 0, 2, true, undefined);
        buffer += id1;
        buffer += '\r\n';
        var config4 = {};
        var params5 = [];
        var id6 = getPropertyOrRunCommandUtil(engine, scopes, {}, "elCls", 0, 3, undefined, true);
        params5.push(id6);
        config4.params = params5;
        config4.fn = function (scopes) {
            var buffer = "";
            buffer += '\r\n ';
            var id7 = getPropertyOrRunCommandUtil(engine, scopes, {}, ".", 0, 4, undefined, false);
            buffer += getExpressionUtil(id7, true);
            buffer += '  \r\n';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config4, "each", 3);
        buffer += '\r\n"\r\n\r\n';
        var config8 = {};
        var params9 = [];
        var id10 = getPropertyOrRunCommandUtil(engine, scopes, {}, "elAttrs", 0, 8, undefined, true);
        params9.push(id10);
        config8.params = params9;
        config8.fn = function (scopes) {
            var buffer = "";
            buffer += ' \r\n ';
            var id11 = getPropertyOrRunCommandUtil(engine, scopes, {}, "xindex", 0, 9, undefined, false);
            buffer += getExpressionUtil(id11, true);
            buffer += '="';
            var id12 = getPropertyOrRunCommandUtil(engine, scopes, {}, ".", 0, 9, undefined, false);
            buffer += getExpressionUtil(id12, true);
            buffer += '"\r\n';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config8, "each", 8);
        buffer += '\r\n\r\nstyle="\r\n';
        var config13 = {};
        var params14 = [];
        var id15 = getPropertyOrRunCommandUtil(engine, scopes, {}, "elStyle", 0, 13, undefined, true);
        params14.push(id15);
        config13.params = params14;
        config13.fn = function (scopes) {
            var buffer = "";
            buffer += ' \r\n ';
            var id16 = getPropertyOrRunCommandUtil(engine, scopes, {}, "xindex", 0, 14, undefined, false);
            buffer += getExpressionUtil(id16, true);
            buffer += ':';
            var id17 = getPropertyOrRunCommandUtil(engine, scopes, {}, ".", 0, 14, undefined, false);
            buffer += getExpressionUtil(id17, true);
            buffer += ';\r\n';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config13, "each", 13);
        buffer += '\r\n">';
        return buffer;
    }
});