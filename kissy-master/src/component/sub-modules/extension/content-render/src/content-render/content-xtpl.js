/*
  Generated by kissy-xtemplate.*/
KISSY.add('component/extension/content-render/content-xtpl', function () {
    return function (scopes, S, undefined) {
        var buffer = "",
            config = this.config,
            engine = this,
            utils = config.utils;
        var runBlockCommandUtil = utils["runBlockCommand"],
            getExpressionUtil = utils["getExpression"],
            getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
        buffer += '<div id="ks-content-';
        var id0 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 1, undefined, false);
        buffer += getExpressionUtil(id0, true);
        buffer += '"\r\n           class="';
        var config2 = {};
        var params3 = [];
        params3.push('content');
        config2.params = params3;
        var id1 = getPropertyOrRunCommandUtil(engine, scopes, config2, "getBaseCssClasses", 0, 2, true, undefined);
        buffer += id1;
        buffer += '">';
        var id4 = getPropertyOrRunCommandUtil(engine, scopes, {}, "content", 0, 2, undefined, false);
        buffer += getExpressionUtil(id4, false);
        buffer += '</div>';
        return buffer;
    }
});