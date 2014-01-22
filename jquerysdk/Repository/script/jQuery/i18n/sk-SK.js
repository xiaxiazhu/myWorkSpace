(function($) {
    var regions = $.i18n.regions,
        en = $.i18n.defaults,
        standard = en.calendars.standard,
        region = regions["sk-SK"] = $.extend(true, {}, en, {
        name: "sk-SK",
        englishName: "Slovak (Slovakia)",
        nativeName: "slovenčina (Slovenská republika)",
        language: "sk",
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
                symbol: "€"
            }}
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': ". ",
                firstDay: 1,
                days: {
                    names: ["nedeľa","pondelok","utorok","streda","štvrtok","piatok","sobota"],
                    namesAbbr: ["ne","po","ut","st","št","pi","so"],
                    namesShort: ["ne","po","ut","st","št","pi","so"]
                },
                months: {
                    names: ["január","február","marec","apríl","máj","jún","júl","august","september","október","november","december",""],
                    namesAbbr: ["1","2","3","4","5","6","7","8","9","10","11","12",""]
                },
                monthsGenitive: {
                    names: ["januára","februára","marca","apríla","mája","júna","júla","augusta","septembra","októbra","novembra","decembra",""],
                    namesAbbr: ["1","2","3","4","5","6","7","8","9","10","11","12",""]
                },
                AM: null,
                PM: null,
                eras: [{"name":"n. l.","start":null,"offset":0}],
                patterns: {
                    d: "d. M. yyyy",
                    D: "d. MMMM yyyy",
                    t: "H:mm",
                    T: "H:mm:ss",
                    f: "d. MMMM yyyy H:mm",
                    F: "d. MMMM yyyy H:mm:ss",
                    M: "dd MMMM",
                    Y: "MMMM yyyy",
                    l: "d. M. yyyy H:mm",
                    L: "d. M. yyyy H:mm:ss"
                }
            })
        }
    }, regions["sk-SK"]);
    region.calendar = region.calendars.standard;
    region.numberFormat.currency = region.numberFormat.currencies[''];
})(jQuery);