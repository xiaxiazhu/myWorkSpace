/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:42
*/
KISSY.add("editor/plugin/dialog",function(b,c,d,e,f,g){return d.Dialog.extend({initializer:function(){this.plug(new g({handlers:[".ks-editor-dialog-header"],plugins:[new f({constrain:window})]}))},bindUI:function(){e.init(this)},show:function(){this.center();var a=this.get("y");200<a-b.DOM.scrollTop()&&(a=b.DOM.scrollTop()+200,this.set("y",a));this.callSuper()}},{ATTRS:{prefixCls:{value:"ks-editor-"},zIndex:{value:c.baseZIndex(c.ZIndexManager.OVERLAY)}}})},{requires:["editor","overlay","./focus-fix",
"dd/plugin/constrain","component/plugin/drag"]});
