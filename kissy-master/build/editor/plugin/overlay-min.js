/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:46
*/
KISSY.add("editor/plugin/overlay",function(d,a,b,c){return b.extend({bindUI:function(){c.init(this)}},{ATTRS:{prefixCls:{value:"ks-editor-"},zIndex:{value:a.baseZIndex(a.ZIndexManager.OVERLAY)}}})},{requires:["editor","overlay","./focus-fix"]});
