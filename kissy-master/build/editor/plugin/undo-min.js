/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:47
*/
KISSY.add("editor/plugin/undo",function(e,b,c,f){function d(){}e.augment(d,{pluginRenderUI:function(a){a.addButton("undo",{mode:b.Mode.WYSIWYG_MODE,tooltip:"\u64a4\u9500",editor:a},c.UndoBtn);a.addButton("redo",{mode:b.Mode.WYSIWYG_MODE,tooltip:"\u91cd\u505a",editor:a},c.RedoBtn);f.init(a)}});return d},{requires:["editor","./undo/btn","./undo/cmd"]});
