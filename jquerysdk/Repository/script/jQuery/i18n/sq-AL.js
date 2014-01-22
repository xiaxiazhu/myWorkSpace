(function($) {
    var regions = $.i18n.regions,
        en = $.i18n.defaults,
        standard = en.calendars.standard,
        region = regions["sq-AL"] = $.extend(true, {}, en, {
        name: "sq-AL",
        englishName: "Albanian (Albania)",
        nativeName: "shqipe (Shqipëria)",
        language: "sq",
        numberFormat: {
            ',': ".",
            '.': ",",
            percent: {
                ',': ".",
                '.': ","
            },
            currencies: {'':{
                pattern: ["-n$","n$"],
                ',': ".",
                '.': ",",
                symbol: "Lek"
            }}
        },
        calendars: {
            standard: $.extend(true, {}, standard, {
                '/': "-",
                firstDay: 1,
                days: {
                    names: ["e diel","e hënë","e martë","e mërkurë","e enjte","e premte","e shtunë"],
                    namesAbbr: ["Die","Hën","Mar","Mër","Enj","Pre","Sht"],
                    namesShort: ["Di","Hë","Ma","Më","En","Pr","Sh"]
                },
                months: {
                    names: ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor",""],
                    namesAbbr: ["Jan","Shk","Mar","Pri","Maj","Qer","Kor","Gsh","Sht","Tet","Nën","Dhj",""]
                },
                AM: ["PD","pd","PD"],
                PM: ["MD","md","MD"],
                patterns: {
                    d: "yyyy-MM-dd",
                    D: "yyyy-MM-dd",
                    t: "h:mm.tt",
                    T: "h:mm:ss.tt",
                    f: "yyyy-MM-dd h:mm.tt",
                    F: "yyyy-MM-dd h:mm:ss.tt",
                    Y: "yyyy-MM",
                    l: "yyyy-MM-dd h:mm.tt",
                    L: "yyyy-MM-dd h:mm:ss.tt"
                }
            })
        }
    }, regions["sq-AL"]);
    region.calendar = region.calendars.standard;
    region.numberFormat.currency = region.numberFormat.currencies[''];
})(jQuery);