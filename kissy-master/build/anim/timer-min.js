/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 22 17:03
*/
KISSY.add("anim/timer/easing",function(){function k(a){return a}function i(a,b,c,d){var e=3*a-3*c+1,f=3*c-6*a,k=3*a,j=3*b-3*d+1,i=3*d-6*b,l=3*b;return function(a){a:{for(var b=a,c,d,g=0;8>g;g++){d=((e*b+f)*b+k)*b-a;if(n(d)<h){a=b;break a}c=(3*e*b+2*f)*b+k;if(n(c)<h)break;b-=d/c}c=1;g=0;for(b=a;c>g;){d=((e*b+f)*b+k)*b-a;if(n(d)<h)break;0<d?c=b:g=b;b=(c+g)/2}a=b}return((j*a+i)*a+l)*a}}var l=Math.PI,j=Math.pow,m=Math.sin,b=parseFloat,f=/^cubic-bezier\(([^,]+),([^,]+),([^,]+),([^,]+)\)$/i,e={swing:function(a){return-Math.cos(a*
l)/2+0.5},easeNone:k,linear:k,easeIn:function(a){return a*a},ease:i(0.25,0.1,0.25,1),"ease-in":i(0.42,0,1,1),"ease-out":i(0,0,0.58,1),"ease-in-out":i(0.42,0,0.58,1),"ease-out-in":i(0,0.42,1,0.58),toFn:function(a){var g;return(g=a.match(f))?i(b(g[1]),b(g[2]),b(g[3]),b(g[4])):e[a]||k},easeOut:function(a){return(2-a)*a},easeBoth:function(a){return 1>(a*=2)?0.5*a*a:0.5*(1- --a*(a-2))},easeInStrong:function(a){return a*a*a*a},easeOutStrong:function(a){return 1- --a*a*a*a},easeBothStrong:function(a){return 1>
(a*=2)?0.5*a*a*a*a:0.5*(2-(a-=2)*a*a*a)},elasticIn:function(a){return 0===a||1===a?a:-(j(2,10*(a-=1))*m((a-0.075)*2*l/0.3))},elasticOut:function(a){return 0===a||1===a?a:j(2,-10*a)*m((a-0.075)*2*l/0.3)+1},elasticBoth:function(a){return 0===a||2===(a*=2)?a:1>a?-0.5*j(2,10*(a-=1))*m((a-0.1125)*2*l/0.45):0.5*j(2,-10*(a-=1))*m((a-0.1125)*2*l/0.45)+1},backIn:function(a){1===a&&(a-=0.001);return a*a*(2.70158*a-1.70158)},backOut:function(a){return(a-=1)*a*(2.70158*a+1.70158)+1},backBoth:function(a){var b,
c=(b=2.5949095)+1;return 1>(a*=2)?0.5*a*a*(c*a-b):0.5*((a-=2)*a*(c*a+b)+2)},bounceIn:function(a){return 1-e.bounceOut(1-a)},bounceOut:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+0.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+0.9375:7.5625*(a-=2.625/2.75)*a+0.984375},bounceBoth:function(a){return 0.5>a?0.5*e.bounceIn(2*a):0.5*e.bounceOut(2*a-1)+0.5}},h=1.0E-6,n=Math.abs;return e});
KISSY.add("anim/timer/manager",function(k,i){var l=k.stamp,j,m;j=function(b){return setTimeout(b,15)};m=function(b){clearTimeout(b)};return{runnings:{},timer:null,start:function(b){var f=l(b);this.runnings[f]||(this.runnings[f]=b,this.startTimer())},stop:function(b){this.notRun(b)},notRun:function(b){delete this.runnings[l(b)];k.isEmptyObject(this.runnings)&&this.stopTimer()},pause:function(b){this.notRun(b)},resume:function(b){this.start(b)},startTimer:function(){var b=this;b.timer||(b.timer=j(function e(){b.runFrames()?
b.stopTimer():b.timer=j(e)}))},stopTimer:function(){var b=this.timer;b&&(m(b),this.timer=0)},runFrames:function(){var b,f,e=this.runnings;for(b in e)e[b].frame();for(b in e){f=0;break}return f===i}}});
KISSY.add("anim/timer/fx",function(k,i,l){function j(b){k.mix(this,b);this.pos=0;this.unit=this.unit||""}function m(b,f){return(!b.style||null==b.style[f])&&null!=i.attr(b,f,l,1)?1:0}j.prototype={isCustomFx:0,constructor:j,load:function(b){k.mix(this,b);this.pos=0;this.unit=this.unit||""},frame:function(b){if(1!==this.pos){var f=this.anim,e=this.prop,h=f.node,j=this.from,a=this.propData,g=this.to;if(b===l)var c=k.now(),b=a.duration,c=c-f.startTime-a.delay,b=0>=c?0:c>=b?1:a.easing(c/b);this.pos=b;
j===g||0===b||(this.val=b=this.interpolate(j,g,this.pos),a.frame?a.frame.call(this,f,this):this.isCustomFx||(b===l?(this.pos=1,b=g,e+" update directly ! : "+b+" : "+j+" : "+g):b+=this.unit,this.val=b,m(h,e)?i.attr(h,e,b,1):i.css(h,e,b)))}},interpolate:function(b,f,e){return"number"===typeof b&&"number"===typeof f?Math.round(1E5*(b+(f-b)*e))/1E5:l},cur:function(){var b=this.prop,f=this.anim.node;if(this.isCustomFx)return f[b]||0;if(m(f,b))return i.attr(f,b,l,1);var e,b=i.css(f,b);return isNaN(e=parseFloat(b))?
!b||"auto"===b?0:b:e}};j.Factories={};j.getFx=function(b){var f=j,e;if(!b.isCustomFx&&(e=j.Factories[b.prop]))f=e;return new f(b)};return j},{requires:["dom"]});
KISSY.add("anim/timer/short-hand",function(){return{background:[],border:["borderBottomWidth","borderLeftWidth","borderRightWidth","borderTopWidth"],borderBottom:["borderBottomWidth"],borderLeft:["borderLeftWidth"],borderTop:["borderTopWidth"],borderRight:["borderRightWidth"],font:["fontSize","fontWeight"],margin:["marginBottom","marginLeft","marginRight","marginTop"],padding:["paddingBottom","paddingLeft","paddingRight","paddingTop"]}});
KISSY.add("anim/timer/color",function(k,i,l,j){function m(b){var b=b+"",d;if(d=b.match(n))return[parseInt(d[1]),parseInt(d[2]),parseInt(d[3])];if(d=b.match(a))return[parseInt(d[1]),parseInt(d[2]),parseInt(d[3]),parseInt(d[4])];if(d=b.match(g)){for(b=1;b<d.length;b++)2>d[b].length&&(d[b]+=d[b]);return[parseInt(d[1],f),parseInt(d[2],f),parseInt(d[3],f)]}if(h[b=b.toLowerCase()])return h[b];"only allow rgb or hex color string : "+b;return[255,255,255]}function b(){b.superclass.constructor.apply(this,
arguments)}var f=16,e=Math.floor,h={black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255]},n=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,a=/^rgba\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+),\s*([0-9]+)\)$/i,g=/^#?([0-9A-F]{1,2})([0-9A-F]{1,2})([0-9A-F]{1,2})$/i;j.background.push("backgroundColor");
j.borderColor=["borderBottomColor","borderLeftColor","borderRightColor","borderTopColor"];j.border.push("borderBottomColor","borderLeftColor","borderRightColor","borderTopColor");j.borderBottom.push("borderBottomColor");j.borderLeft.push("borderLeftColor");j.borderRight.push("borderRightColor");j.borderTop.push("borderTopColor");k.extend(b,l,{load:function(){b.superclass.load.apply(this,arguments);this.from&&(this.from=m(this.from));this.to&&(this.to=m(this.to))},interpolate:function(a,d,g){var h=
b.superclass.interpolate;if(3==a.length&&3==d.length)return"rgb("+[e(h(a[0],d[0],g)),e(h(a[1],d[1],g)),e(h(a[2],d[2],g))].join(", ")+")";if(4==a.length||4==d.length)return"rgba("+[e(h(a[0],d[0],g)),e(h(a[1],d[1],g)),e(h(a[2],d[2],g)),e(h(a[3]||1,d[3]||1,g))].join(", ")+")";"unknown value : "+a}});k.each("backgroundColor,borderBottomColor,borderLeftColor,borderRightColor,borderTopColor,color,outlineColor".split(","),function(a){l.Factories[a]=b});return b},{requires:["dom","./fx","./short-hand"]});
KISSY.add("anim/timer/transform",function(k,i,l){function j(h){h=h.split(/,/);return h=k.map(h,function(h){return b(h)})}function m(){return{translateX:0,translateY:0,rotate:0,skewX:0,skewY:0,scaleX:1,scaleY:1}}function b(b){return Math.round(1E5*parseFloat(b))/1E5}function f(h){for(var h=h.split(")"),e=k.trim,a=-1,g=h.length-1,c,d,f=m();++a<g;)switch(c=h[a].split("("),d=e(c[0]),c=c[1],d){case "translateX":case "translateY":case "scaleX":case "scaleY":f[d]=b(c);break;case "rotate":case "skewX":case "skewY":var i=
b(c);k.endsWith(c,"deg")||(i=180*i/Math.PI);f[d]=i;break;case "translate":case "translate3d":c=c.split(",");f.translateX=b(c[0]);f.translateY=b(c[1]||0);break;case "scale":c=c.split(",");f.scaleX=b(c[0]);f.scaleY=b(c[1]||c[0]);break;case "matrix":return h=c,h=j(h),g=a=e=void 0,d=h[0],f=h[1],c=h[2],i=h[3],d*i-f*c?(e=Math.sqrt(d*d+f*f),d/=e,f/=e,g=d*c+f*i,c-=d*g,i-=f*g,a=Math.sqrt(c*c+i*i),c/=a,i/=a,g/=a,d*i<f*c&&(d=-d,f=-f,g=-g,e=-e)):e=a=g=0,{translateX:b(h[4]),translateY:b(h[5]),rotate:b(180*Math.atan2(f,
d)/Math.PI),skewX:b(180*Math.atan(g)/Math.PI),skewY:0,scaleX:b(e),scaleY:b(a)}}return f}function e(){e.superclass.constructor.apply(this,arguments)}k.extend(e,l,{load:function(){e.superclass.load.apply(this,arguments);this.from=(this.from=i.style(this.anim.node,"transform")||this.from)&&"none"!=this.from?f(this.from):m();this.to=this.to?f(this.to):m()},interpolate:function(b,f,a){var g=e.superclass.interpolate,c={};c.translateX=g(b.translateX,f.translateX,a);c.translateY=g(b.translateY,f.translateY,
a);c.rotate=g(b.rotate,f.rotate,a);c.skewX=g(b.skewX,f.skewX,a);c.skewY=g(b.skewY,f.skewY,a);c.scaleX=g(b.scaleX,f.scaleX,a);c.scaleY=g(b.scaleY,f.scaleY,a);return k.substitute("translate3d({translateX}px,{translateY}px,0) rotate({rotate}deg) skewX({skewX}deg) skewY({skewY}deg) scale({scaleX},{scaleY})",c)}});return l.Factories.transform=e},{requires:["dom","./fx"]});
KISSY.add("anim/timer",function(k,i,l,j,m,b,f){function e(){var a;e.superclass.constructor.apply(this,arguments);k.each(a=this.to,function(b,c){var d=h(c);c!=d&&(a[d]=a[c],delete a[c])})}var h=i._camelCase,n=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i;k.extend(e,l,{prepareFx:function(){var a=this.node,g=this._propsData;k.each(g,function(a){a.duration*=1E3;a.delay*=1E3;"string"==typeof a.easing&&(a.easing=j.toFn(a.easing))});k.each(f,function(b,c){var d,e=g[c],f;e&&(f=e.value,d={},k.each(b,function(b){d[b]=
i.css(a,b)}),i.css(a,c,f),k.each(d,function(b,c){c in g||(g[c]=k.merge(e,{value:i.css(a,c)}));i.css(a,c,b)}),delete g[c])});var c,d,e,h,l,m,p,s=0,o;k.isPlainObject(a)&&(s=1);for(c in g){d=g[c];e=d.value;m={isCustomFx:s,prop:c,anim:this,propData:d};p=b.getFx(m);h=e;l=p.cur();e+="";o="";if(e=e.match(n)){h=parseFloat(e[2]);if((o=e[3])&&"px"!==o&&l){var q=0,r=h;do++r,i.css(a,c,r+o),q=p.cur();while(0==q);l*=r/q;i.css(a,c,l+o)}e[1]&&(h=("-="===e[1]?-1:1)*h+l)}m.from=l;m.to=h;m.unit=o;p.load(m);d.fx=p}},
frame:function(){var a,b=1,c,d=this._propsData;for(a in d){c=d[a];c=c.fx;c.frame();if(this.isRejected()||this.isResolved())return;b&=1==c.pos}d=k.now();a=1E3*this.config.duration;d=Math.max(0,this.startTime+a-d);this.defer.notify([this,1-(d/a||0),d]);b&&this.stop(b)},doStop:function(a){var b,c=this._propsData;m.stop(this);if(a)for(b in c)a=c[b],(a=a.fx)&&a.frame(1)},doStart:function(){m.start(this)}});e.Easing=j;e.Fx=b;return e},{requires:"dom,./base,./timer/easing,./timer/manager,./timer/fx,./timer/short-hand,./timer/color,./timer/transform".split(",")});
