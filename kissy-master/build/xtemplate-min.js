/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Sep 17 23:11
*/
KISSY.add("xtemplate",function(g,a,h){function b(a,c){c=g.merge(j,c);if("string"==typeof a){var e=a,f=c,d;if(!f.cache||!(d=i[e]))d=h.compileToFn(e,f),f.cache&&(i[e]=d);a=d}b.superclass.constructor.call(this,a,c)}var i=b.cache={},j={cache:!0};g.extend(b,a,{},{compiler:h,RunTime:a,addCommand:a.addCommand,removeCommand:a.removeCommand});return b},{requires:["xtemplate/runtime","xtemplate/compiler"]});
