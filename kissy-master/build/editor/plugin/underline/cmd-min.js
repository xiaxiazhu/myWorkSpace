/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:47
*/
KISSY.add("editor/plugin/underline/cmd",function(d,a,b){var c=new a.Style({element:"u",overrides:[{element:"span",attributes:{style:"text-decoration: underline;"}}]});return{init:function(a){b.addButtonCmd(a,"underline",c)}}},{requires:["editor","../font/cmd"]});
