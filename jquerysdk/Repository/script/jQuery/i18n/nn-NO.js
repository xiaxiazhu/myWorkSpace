(function($) {
    var regions = $.i18n.regions,
        en = $.i18n.defaults,
        standard = en.calendars.standard,
        region = regions["nn-NO"] = $.extend(true, {}, en, {
        name: "nn-NO",
        englishName: "Norwegian, Nynorsk (Norway)",
        nativeName: "norsk, nynorsk (Noreg)",
        language: "nn",
        numberFormat: {
            ',': " ",
            '.': ",",
            percent: {
                ',': " ",
                '.': ","
            },
            currencies: {'':{
                pattern: ["$ -n","$ n"],
                ',': " ",
                '.': ",",
                symbol: "kr"
            }}
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': ".",
                firstDay: 1,
                days: {
                    names: ["søndag","måndag","tysdag","onsdag","torsdag","fredag","laurdag"],
                    namesAbbr: ["sø","må","ty","on","to","fr","la"],
                    namesShort: ["sø","må","ty","on","to","fr","la"]
                },
                months: {
                    names: ["januar","februar","mars","april","mai","juni","juli","august","september","oktober","november","desember",""],
                    namesAbbr: ["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des",""]
                },
                AM: null,
                PM: null,
                patterns: {
                    d: "dd.MM.yyyy",
                    D: "d. MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "d. MMMM yyyy HH:mm",
                    F: "d. MMMM yyyy HH:mm:ss",
                    M: "d. MMMM",
                    Y: "MMMM yyyy",
                    l: "dd.MM.yyyy HH:mm",
                    L: "dd.MM.yyyy HH:mm:ss"
                }
            })
        }
    }, regions["nn-NO"]);
    region.calendar = region.calendars.standard;
    region.numberFormat.currency = region.numberFormat.currencies[''];
})(jQuery);