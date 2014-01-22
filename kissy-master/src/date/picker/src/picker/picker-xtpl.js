/*
  Generated by kissy-xtemplate.*/
KISSY.add('date/picker/picker-xtpl', function () {
    return function (scopes, S, undefined) {
        var buffer = "",
            config = this.config,
            engine = this,
            utils = config.utils;
        var runBlockCommandUtil = utils["runBlockCommand"],
            getExpressionUtil = utils["getExpression"],
            getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
        buffer += '<div class="';
        var config1 = {};
        var params2 = [];
        params2.push('header');
        config1.params = params2;
        var id0 = getPropertyOrRunCommandUtil(engine, scopes, config1, "getBaseCssClasses", 0, 1, true, undefined);
        buffer += id0;
        buffer += '">\r\n    <a id="ks-date-picker-previous-year-btn-';
        var id3 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 2, undefined, false);
        buffer += getExpressionUtil(id3, true);
        buffer += '"\r\n       class="';
        var config5 = {};
        var params6 = [];
        params6.push('prev-year-btn');
        config5.params = params6;
        var id4 = getPropertyOrRunCommandUtil(engine, scopes, config5, "getBaseCssClasses", 0, 3, true, undefined);
        buffer += id4;
        buffer += '"\r\n       href="#"\r\n       tabindex="-1"\r\n       role="button"\r\n       title="';
        var id7 = getPropertyOrRunCommandUtil(engine, scopes, {}, "previousYearLabel", 0, 7, undefined, false);
        buffer += getExpressionUtil(id7, true);
        buffer += '"\r\n       hidefocus="on">\r\n    </a>\r\n    <a id="ks-date-picker-previous-month-btn-';
        var id8 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 10, undefined, false);
        buffer += getExpressionUtil(id8, true);
        buffer += '"\r\n       class="';
        var config10 = {};
        var params11 = [];
        params11.push('prev-month-btn');
        config10.params = params11;
        var id9 = getPropertyOrRunCommandUtil(engine, scopes, config10, "getBaseCssClasses", 0, 11, true, undefined);
        buffer += id9;
        buffer += '"\r\n       href="#"\r\n       tabindex="-1"\r\n       role="button"\r\n       title="';
        var id12 = getPropertyOrRunCommandUtil(engine, scopes, {}, "previousMonthLabel", 0, 15, undefined, false);
        buffer += getExpressionUtil(id12, true);
        buffer += '"\r\n       hidefocus="on">\r\n    </a>\r\n    <a class="';
        var config14 = {};
        var params15 = [];
        params15.push('month-select');
        config14.params = params15;
        var id13 = getPropertyOrRunCommandUtil(engine, scopes, config14, "getBaseCssClasses", 0, 18, true, undefined);
        buffer += id13;
        buffer += '"\r\n       role="button"\r\n       href="#"\r\n       tabindex="-1"\r\n       hidefocus="on"\r\n       title="';
        var id16 = getPropertyOrRunCommandUtil(engine, scopes, {}, "monthSelectLabel", 0, 23, undefined, false);
        buffer += getExpressionUtil(id16, true);
        buffer += '"\r\n       id="ks-date-picker-month-select-';
        var id17 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 24, undefined, false);
        buffer += getExpressionUtil(id17, true);
        buffer += '">\r\n        <span id="ks-date-picker-month-select-content-';
        var id18 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 25, undefined, false);
        buffer += getExpressionUtil(id18, true);
        buffer += '">';
        var id19 = getPropertyOrRunCommandUtil(engine, scopes, {}, "monthYearLabel", 0, 25, undefined, false);
        buffer += getExpressionUtil(id19, true);
        buffer += '</span>\r\n        <span class="';
        var config21 = {};
        var params22 = [];
        params22.push('month-select-arrow');
        config21.params = params22;
        var id20 = getPropertyOrRunCommandUtil(engine, scopes, config21, "getBaseCssClasses", 0, 26, true, undefined);
        buffer += id20;
        buffer += '">x</span>\r\n    </a>\r\n    <a id="ks-date-picker-next-month-btn-';
        var id23 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 28, undefined, false);
        buffer += getExpressionUtil(id23, true);
        buffer += '"\r\n       class="';
        var config25 = {};
        var params26 = [];
        params26.push('next-month-btn');
        config25.params = params26;
        var id24 = getPropertyOrRunCommandUtil(engine, scopes, config25, "getBaseCssClasses", 0, 29, true, undefined);
        buffer += id24;
        buffer += '"\r\n       href="#"\r\n       tabindex="-1"\r\n       role="button"\r\n       title="';
        var id27 = getPropertyOrRunCommandUtil(engine, scopes, {}, "nextMonthLabel", 0, 33, undefined, false);
        buffer += getExpressionUtil(id27, true);
        buffer += '"\r\n       hidefocus="on">\r\n    </a>\r\n    <a id="ks-date-picker-next-year-btn-';
        var id28 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 36, undefined, false);
        buffer += getExpressionUtil(id28, true);
        buffer += '"\r\n       class="';
        var config30 = {};
        var params31 = [];
        params31.push('next-year-btn');
        config30.params = params31;
        var id29 = getPropertyOrRunCommandUtil(engine, scopes, config30, "getBaseCssClasses", 0, 37, true, undefined);
        buffer += id29;
        buffer += '"\r\n       href="#"\r\n       tabindex="-1"\r\n       role="button"\r\n       title="';
        var id32 = getPropertyOrRunCommandUtil(engine, scopes, {}, "nextYearLabel", 0, 41, undefined, false);
        buffer += getExpressionUtil(id32, true);
        buffer += '"\r\n       hidefocus="on">\r\n    </a>\r\n</div>\r\n<div class="';
        var config34 = {};
        var params35 = [];
        params35.push('body');
        config34.params = params35;
        var id33 = getPropertyOrRunCommandUtil(engine, scopes, config34, "getBaseCssClasses", 0, 45, true, undefined);
        buffer += id33;
        buffer += '">\r\n    <table class="';
        var config37 = {};
        var params38 = [];
        params38.push('table');
        config37.params = params38;
        var id36 = getPropertyOrRunCommandUtil(engine, scopes, config37, "getBaseCssClasses", 0, 46, true, undefined);
        buffer += id36;
        buffer += '" cellspacing="0" role="grid">\r\n        <thead>\r\n        <tr role="row">\r\n            ';
        var config39 = {};
        var params40 = [];
        var id41 = getPropertyOrRunCommandUtil(engine, scopes, {}, "showWeekNumber", 0, 49, undefined, true);
        params40.push(id41);
        config39.params = params40;
        config39.fn = function (scopes) {
            var buffer = "";
            buffer += '\r\n            <th role="columnheader" class="';
            var config43 = {};
            var params44 = [];
            params44.push('column-header');
            config43.params = params44;
            var id42 = getPropertyOrRunCommandUtil(engine, scopes, config43, "getBaseCssClasses", 0, 50, true, undefined);
            buffer += id42;
            buffer += ' ';
            var config46 = {};
            var params47 = [];
            params47.push('week-number-header');
            config46.params = params47;
            var id45 = getPropertyOrRunCommandUtil(engine, scopes, config46, "getBaseCssClasses", 0, 50, true, undefined);
            buffer += id45;
            buffer += '">\r\n                <span class="';
            var config49 = {};
            var params50 = [];
            params50.push('column-header-inner');
            config49.params = params50;
            var id48 = getPropertyOrRunCommandUtil(engine, scopes, config49, "getBaseCssClasses", 0, 51, true, undefined);
            buffer += id48;
            buffer += '">x</span>\r\n            </th>\r\n            ';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config39, "if", 49);
        buffer += '\r\n            ';
        var config51 = {};
        var params52 = [];
        var id53 = getPropertyOrRunCommandUtil(engine, scopes, {}, "weekdays", 0, 54, undefined, true);
        params52.push(id53);
        config51.params = params52;
        config51.fn = function (scopes) {
            var buffer = "";
            buffer += '\r\n            <th role="columnheader" title="';
            var id54 = getPropertyOrRunCommandUtil(engine, scopes, {}, ".", 0, 55, undefined, false);
            buffer += getExpressionUtil(id54, true);
            buffer += '" class="';
            var config56 = {};
            var params57 = [];
            params57.push('column-header');
            config56.params = params57;
            var id55 = getPropertyOrRunCommandUtil(engine, scopes, config56, "getBaseCssClasses", 0, 55, true, undefined);
            buffer += id55;
            buffer += '">\r\n                <span class="';
            var config59 = {};
            var params60 = [];
            params60.push('column-header-inner');
            config59.params = params60;
            var id58 = getPropertyOrRunCommandUtil(engine, scopes, config59, "getBaseCssClasses", 0, 56, true, undefined);
            buffer += id58;
            buffer += '">\r\n                    ';
            var id62 = getPropertyOrRunCommandUtil(engine, scopes, {}, "xindex", 0, 57, undefined, true);
            var id61 = getPropertyOrRunCommandUtil(engine, scopes, {}, "veryShortWeekdays." + id62 + "", 0, 57, undefined, false);
            buffer += getExpressionUtil(id61, true);
            buffer += '\r\n                </span>\r\n            </th>\r\n            ';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config51, "each", 54);
        buffer += '\r\n        </tr>\r\n        </thead>\r\n        <tbody id="ks-date-picker-tbody-';
        var id63 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 63, undefined, false);
        buffer += getExpressionUtil(id63, true);
        buffer += '">\r\n        ';
        var id64 = getPropertyOrRunCommandUtil(engine, scopes, {}, "renderDates", 0, 64, undefined, false);
        buffer += getExpressionUtil(id64, false);
        buffer += '\r\n        </tbody>\r\n    </table>\r\n</div>\r\n';
        var config65 = {};
        var params66 = [];
        var id67 = getPropertyOrRunCommandUtil(engine, scopes, {}, "showToday", 0, 68, undefined, true);
        var id68 = getPropertyOrRunCommandUtil(engine, scopes, {}, "showClear", 0, 68, undefined, true);
        params66.push(id67 || id68);
        config65.params = params66;
        config65.fn = function (scopes) {
            var buffer = "";
            buffer += '\r\n<div class="';
            var config70 = {};
            var params71 = [];
            params71.push('footer');
            config70.params = params71;
            var id69 = getPropertyOrRunCommandUtil(engine, scopes, config70, "getBaseCssClasses", 0, 69, true, undefined);
            buffer += id69;
            buffer += '">\r\n    <a class="';
            var config73 = {};
            var params74 = [];
            params74.push('today-btn');
            config73.params = params74;
            var id72 = getPropertyOrRunCommandUtil(engine, scopes, config73, "getBaseCssClasses", 0, 70, true, undefined);
            buffer += id72;
            buffer += '"\r\n       role="button"\r\n       hidefocus="on"\r\n       tabindex="-1"\r\n       href="#"\r\n       id="ks-date-picker-today-btn-';
            var id75 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 75, undefined, false);
            buffer += getExpressionUtil(id75, true);
            buffer += '"\r\n       title="';
            var id76 = getPropertyOrRunCommandUtil(engine, scopes, {}, "todayTimeLabel", 0, 76, undefined, false);
            buffer += getExpressionUtil(id76, true);
            buffer += '">';
            var id77 = getPropertyOrRunCommandUtil(engine, scopes, {}, "todayLabel", 0, 76, undefined, false);
            buffer += getExpressionUtil(id77, true);
            buffer += '</a>\r\n    <a class="';
            var config79 = {};
            var params80 = [];
            params80.push('clear-btn');
            config79.params = params80;
            var id78 = getPropertyOrRunCommandUtil(engine, scopes, config79, "getBaseCssClasses", 0, 77, true, undefined);
            buffer += id78;
            buffer += '"\r\n       role="button"\r\n       hidefocus="on"\r\n       tabindex="-1"\r\n       href="#"\r\n       id="ks-date-picker-clear-btn-';
            var id81 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 82, undefined, false);
            buffer += getExpressionUtil(id81, true);
            buffer += '">';
            var id82 = getPropertyOrRunCommandUtil(engine, scopes, {}, "clearLabel", 0, 82, undefined, false);
            buffer += getExpressionUtil(id82, true);
            buffer += '</a>\r\n</div>\r\n';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config65, "if", 68);
        return buffer;
    }
});