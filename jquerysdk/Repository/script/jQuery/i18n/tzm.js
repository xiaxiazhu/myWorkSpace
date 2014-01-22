(function($) {
    var regions = $.i18n.regions,
        en = $.i18n.defaults,
        standard = en.calendars.standard,
        region = regions["tzm"] = $.extend(true, {}, en, {
        name: "tzm",
        englishName: "Tamazight",
        nativeName: "Tamazight",
        language: "tzm",
        numberFormat: {
            pattern: ["n-"],
            ',': ".",
            '.': ",",
            percent: {
                ',': ".",
                '.': ","
            },
            currencies: {'':{
                pattern: ["-n $","n $"],
                symbol: "DZD"
            }}
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': "-",
                firstDay: 6,
                days: {
                    names: ["Acer","Arime","Aram","Ahad","Amhadh","Sem","Sedh"],
                    namesAbbr: ["Ace","Ari","Ara","Aha","Amh","Sem","Sed"],
                    namesShort: ["Ac","Ar","Ar","Ah","Am","Se","Se"]
                },
                months: {
                    names: ["Yenayer","Furar","Maghres","Yebrir","Mayu","Yunyu","Yulyu","Ghuct","Cutenber","Ktuber","Wambir","Dujanbir",""],
                    namesAbbr: ["Yen","Fur","Mag","Yeb","May","Yun","Yul","Ghu","Cut","Ktu","Wam","Duj",""]
                },
                AM: null,
                PM: null,
                patterns: {
                    d: "dd-MM-yyyy",
                    D: "dd MMMM, yyyy",
                    t: "H:mm",
                    T: "H:mm:ss",
                    f: "dd MMMM, yyyy H:mm",
                    F: "dd MMMM, yyyy H:mm:ss",
                    M: "dd MMMM",
                    l: "dd-MM-yyyy H:mm",
                    L: "dd-MM-yyyy H:mm:ss"
                }
            })
        }
    }, regions["tzm"]);
    region.calendar = region.calendars.standard;
    region.numberFormat.currency = region.numberFormat.currencies[''];
})(jQuery);