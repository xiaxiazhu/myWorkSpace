(function($) {
    var regions = $.i18n.regions,
        en = $.i18n.defaults,
        standard = en.calendars.standard,
        region = regions["fr-BE"] = $.extend(true, {}, en, {
        name: "fr-BE",
        englishName: "French (Belgium)",
        nativeName: "français (Belgique)",
        language: "fr",
        numberFormat: {
            ',': ".",
            '.': ",",
            percent: {
                ',': ".",
                '.': ","
            },
            currencies: {'':{
                pattern: ["$ -n","$ n"],
                ',': ".",
                '.': ",",
                symbol: "€"
            }}
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                firstDay: 1,
				firstWeekMin: 4,
                days: {
                    names: ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
                    namesAbbr: ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],
                    namesShort: ["di","lu","ma","me","je","ve","sa"]
                },
                months: {
                    names: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre",""],
                    namesAbbr: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc.",""]
                },
                AM: null,
                PM: null,
                eras: [{"name":"ap. J.-C.","start":null,"offset":0}],
                patterns: {
                    d: "d/MM/yyyy",
                    D: "dddd d MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "dddd d MMMM yyyy HH:mm",
                    F: "dddd d MMMM yyyy HH:mm:ss",
                    M: "d MMMM",
                    Y: "MMMM yyyy",
                    l: "d/MM/yyyy HH:mm",
                    L: "d/MM/yyyy HH:mm:ss"
                }
            })
        }
    }, regions["fr-BE"]);
    region.calendar = region.calendars.standard;
    region.numberFormat.currency = region.numberFormat.currencies[''];
})(jQuery);