/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:44
*/
KISSY.add("editor/plugin/fore-color/cmd",function(e,b){var c={element:"span",styles:{color:"#(color)"},overrides:[{element:"font",attributes:{color:null}}],childRule:function(a){return!("a"==a.nodeName()||a.all("a").length)}};return{init:function(a){a.hasCommand("foreColor")||a.addCommand("foreColor",{exec:function(a,d){a.execCommand("save");b.applyColor(a,d,c);a.execCommand("save")}})}}},{requires:["../color/cmd"]});
