/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:44
*/
KISSY.add("editor/plugin/italic",function(c,g,e,f){function d(){}c.augment(d,{pluginRenderUI:function(a){f.init(a);a.addButton("italic",{cmdType:"italic",tooltip:"\u659c\u4f53 "},e.Button);a.docReady(function(){a.get("document").on("keydown",function(b){b.ctrlKey&&b.keyCode==c.Node.KeyCode.I&&(a.execCommand("italic"),b.preventDefault())})})}});return d},{requires:["editor","./font/ui","./italic/cmd"]});
