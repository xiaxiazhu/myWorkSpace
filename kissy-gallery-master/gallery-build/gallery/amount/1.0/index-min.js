KISSY.add("gallery/amount/1.0/amount",function(f,g){function h(a,c){h.superclass.constructor.call(this);this.set("num",a);this.set("hasDecimal",c)}f.extend(h,g,{convertAmount:function(){var a=this.get("num"),c,b="";if(this.get("hasDecimal"))return b=a.replace(/\.+/g,".").replace(/(\.*$)/,""),c=b.indexOf("."),-1!==c?(a=b.substr(0,c),b=b.substr(c,4).replace(/\./g,"").substr(0,2),1===b.length&&(b+="0")):(a=b,b="00"),this._convertNatural(a)+this._convertDecimal(b);b=a.toString().replace(/\./g,"");return this._convertNatural(b)},
_convertNatural:function(a){var c=this.get("_chineseArr"),b=",\u62fe,\u4f70,\u4edf,\u4e07,\u4ebf,\u70b9,".split(","),d="",e=0;if(""===a)return"\u96f6";for(i=a.length-1;0<=i;i--){switch(e){case 0:d=b[7]+d;break;case 4:d=b[4]+d;break;case 8:d=b[5]+d,b[7]=b[5],e=0}2===e%4&&"0"===a.charAt(i)&&"0"!==a.charAt(i+2)&&(d=c[0]+d);"0"!==a.charAt(i)&&(d=c[a.charAt(i)]+b[e%4]+d);e++}return d},_convertDecimal:function(a){var c="\u70b9",b=this.get("_chineseArr");return c+=b[a.charAt(0)]+b[a.charAt(1)]}},{ATTRS:{num:{value:"",setter:function(a){return!f.isString(a)&&
!f.isNumber(a)?(console.log("\u8bf7\u4f20\u5165\u6b63\u786e\u683c\u5f0f\u7684\u53c2\u6570"),""):a.toString().replace(/[^0-9\.]/g,"").replace(/(^0*)/,"")},getter:function(a){return a}},hasDecimal:{value:!1,setter:function(a){return a},getter:function(a){return a}},_chineseArr:{value:"\u96f6,\u58f9,\u8d30,\u53c1,\u8086,\u4f0d,\u9646,\u67d2,\u634c,\u7396".split(",")}}});return h},{requires:["base"]});KISSY.add("gallery/amount/1.0/index",function(f,g){return g},{requires:["./amount"]});
