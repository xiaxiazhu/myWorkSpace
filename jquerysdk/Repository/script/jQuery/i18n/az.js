(function($) {
    var regions = $.i18n.regions,
        en = $.i18n.defaults,
        standard = en.calendars.standard,
        region = regions["az"] = $.extend(true, {}, en, {
        name: "az",
        englishName: "Azeri",
        nativeName: "Azərbaycan­ılı",
        language: "az",
        numberFormat: {
            ',': " ",
            '.': ",",
            percent: {
                pattern: ["-n%","n%"],
                ',': " ",
                '.': ","
            },
            currencies: {'':{
                pattern: ["-n $","n $"],
                ',': " ",
                '.': ",",
                symbol: "man."
            }}
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': ".",
                firstDay: 1,
                days: {
                    names: ["Bazar","Bazar ertəsi","Çərşənbə axşamı","Çərşənbə","Cümə axşamı","Cümə","Şənbə"],
                    namesAbbr: ["B","Be","Ça","Ç","Ca","C","Ş"],
                    namesShort: ["B","Be","Ça","Ç","Ca","C","Ş"]
                },
                months: {
                    names: ["Yanvar","Fevral","Mart","Aprel","May","İyun","İyul","Avgust","Sentyabr","Oktyabr","Noyabr","Dekabr",""],
                    namesAbbr: ["Yan","Fev","Mar","Apr","May","İyun","İyul","Avg","Sen","Okt","Noy","Dek",""]
                },
                monthsGenitive: {
                    names: ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentyabr","oktyabr","noyabr","dekabr",""],
                    namesAbbr: ["Yan","Fev","Mar","Apr","May","İyun","İyul","Avg","Sen","Okt","Noy","Dek",""]
                },
                AM: null,
                PM: null,
                patterns: {
                    d: "dd.MM.yyyy",
                    D: "d MMMM yyyy",
                    t: "H:mm",
                    T: "H:mm:ss",
                    f: "d MMMM yyyy H:mm",
                    F: "d MMMM yyyy H:mm:ss",
                    M: "d MMMM",
                    Y: "MMMM yyyy",
                    l: "dd.MM.yyyy H:mm",
                    L: "dd.MM.yyyy H:mm:ss"
                }
            })
        }
    }, regions["az"]);
    region.calendar = region.calendars.standard;
    region.numberFormat.currency = region.numberFormat.currencies[''];
})(jQuery);