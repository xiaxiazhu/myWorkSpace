/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 17 22:58
*/
KISSY.add("component/plugin/resize",function(e,d){return d.extend({pluginBindUI:function(a){var b=a.$el;this.set("node",b);this.set("prefixCls",a.get("prefixCls"));this.on("resizeEnd",function(){var c=b.offset();a.setInternal("xy",[c.left,c.top]);a.setInternal("width",b.width());a.setInternal("height",b.height())})},pluginDestructor:function(){this.destroy()}})},{requires:["resizable"]});
