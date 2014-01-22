/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Oct 31 11:06
*/
KISSY.add("event/dom/touch/handle-map",function(){return{}});KISSY.add("event/dom/touch/single-touch",function(b){function c(){}c.prototype={constructor:c,requiredTouchCount:1,onTouchStart:function(b){if(b.touches.length!=this.requiredTouchCount)return!1;b=this.lastTouches=b.touches;this.lastXY={pageX:b[0].pageX,pageY:b[0].pageY}},onTouchMove:b.noop,onTouchEnd:b.noop};return c});
KISSY.add("event/dom/touch/tap",function(b,c,d,a){function e(b){b.preventDefault()}function f(){f.superclass.constructor.apply(this,arguments)}var m=d.Object;b.extend(f,a,{onTouchMove:function(b){var a=this.lastXY,b=b.changedTouches[0];if(!b||5<Math.abs(b.pageX-a.pageX)||5<Math.abs(b.pageY-a.pageY))return!1},onTouchEnd:function(a){var c=a.changedTouches[0],a=a.target,k=new m({type:"tap",target:a,currentTarget:a});b.mix(k,{pageX:c.pageX,pageY:c.pageY,which:1,touch:c});d.fire(a,"tap",k);if(k.isDefaultPrevented())d.on(a,
"click",{fn:e,once:1})}});c.tap={handle:new f};return f},{requires:["./handle-map","event/dom/base","./single-touch"]});
KISSY.add("event/dom/touch/swipe",function(b,c,d,a){function e(a,b,c){var e=b.changedTouches[0],g=e.pageX-a.startX,j=e.pageY-a.startY,p=Math.abs(g),f=Math.abs(j);if(c){if(a.isVertical&&a.isHorizontal){if(5>Math.max(p,f))return;f>p?a.isHorizontal=0:a.isVertical=0}}else if(a.isVertical&&f<o&&(a.isVertical=0),a.isHorizontal&&p<o)a.isHorizontal=0;if(a.isHorizontal)g=0>g?"left":"right";else if(a.isVertical)g=0>j?"up":"down",p=f;else return!1;d.fire(b.target,c?n:m,{originalEvent:b.originalEvent,pageX:e.pageX,
pageY:e.pageY,which:1,touch:e,direction:g,distance:p,duration:(b.timeStamp-a.startTime)/1E3})}function f(){}var m="swipe",n="swiping",o=50;b.extend(f,a,{onTouchStart:function(a){if(!1===f.superclass.onTouchStart.apply(this,arguments))return!1;var b=a.touches[0];this.startTime=a.timeStamp;this.isVertical=this.isHorizontal=1;this.startX=b.pageX;this.startY=b.pageY;-1!=a.type.indexOf("mouse")&&a.preventDefault()},onTouchMove:function(a){var b=a.changedTouches[0],c=b.pageY-this.startY,b=Math.abs(b.pageX-
this.startX),c=Math.abs(c);if(1E3<a.timeStamp-this.startTime)return!1;this.isVertical&&35<b&&(this.isVertical=0);this.isHorizontal&&35<c&&(this.isHorizontal=0);return e(this,a,1)},onTouchEnd:function(a){return!1===this.onTouchMove(a)?!1:e(this,a,0)}});c[m]=c[n]={handle:new f};return f},{requires:["./handle-map","event/dom/base","./single-touch"]});
KISSY.add("event/dom/touch/double-tap",function(b,c,d,a){function e(){}b.extend(e,a,{onTouchStart:function(a){if(!1===e.superclass.onTouchStart.apply(this,arguments))return!1;this.startTime=a.timeStamp;this.singleTapTimer&&(clearTimeout(this.singleTapTimer),this.singleTapTimer=0)},onTouchMove:function(){return!1},onTouchEnd:function(a){var b=this.lastEndTime,c=a.timeStamp,e=a.target,k=a.changedTouches[0],h=c-this.startTime;this.lastEndTime=c;if(b&&(h=c-b,300>h)){this.lastEndTime=0;d.fire(e,"doubleTap",
{touch:k,duration:h/1E3});return}h=c-this.startTime;300<h?d.fire(e,"singleTap",{touch:k,pageX:k.pageX,which:1,pageY:k.pageY,duration:h/1E3}):this.singleTapTimer=setTimeout(function(){d.fire(e,"singleTap",{touch:k,pageX:k.pageX,which:1,pageY:k.pageY,duration:h/1E3})},300)}});c.singleTap=c.doubleTap={handle:new e};return e},{requires:["./handle-map","event/dom/base","./single-touch"]});
KISSY.add("event/dom/touch/multi-touch",function(b,c){function d(){}d.prototype={constructor:d,requiredTouchCount:2,onTouchStart:function(a){var b=this.requiredTouchCount,c=a.touches.length;c===b?this.start():c>b&&this.end(a)},onTouchEnd:function(a){this.end(a)},start:function(){this.isTracking||(this.isTracking=!0,this.isStarted=!1)},fireEnd:b.noop,getCommonTarget:function(a){var b=a.touches,a=b[0].target,b=b[1].target;if(a==b||c.contains(a,b))return a;for(;;){if(c.contains(b,a))return b;b=b.parentNode}"getCommonTarget error!"},
end:function(a){this.isTracking&&(this.isTracking=!1,this.isStarted&&(this.isStarted=!1,this.fireEnd(a)))}};return d},{requires:["dom"]});
KISSY.add("event/dom/touch/pinch",function(b,c,d,a){function e(){}function f(a){2==a.touches.length&&a.preventDefault()}b.extend(e,a,{onTouchMove:function(a){if(this.isTracking){var c=a.touches,e,f=c[0],h=c[1];e=f.pageX-h.pageX;f=f.pageY-h.pageY;e=Math.sqrt(e*e+f*f);this.lastTouches=c;this.isStarted?d.fire(this.target,"pinch",b.mix(a,{distance:e,scale:e/this.startDistance})):(this.isStarted=!0,this.startDistance=e,c=this.target=this.getCommonTarget(a),d.fire(c,"pinchStart",b.mix(a,{distance:e,scale:1})))}},
fireEnd:function(a){d.fire(this.target,"pinchEnd",b.mix(a,{touches:this.lastTouches}))}});a=new e;c.pinchStart=c.pinchEnd={handle:a};c.pinch={handle:a,add:function(){d.on(this,"touchmove",f)},remove:function(){d.detach(this,"touchmove",f)}};return e},{requires:["./handle-map","event/dom/base","./multi-touch"]});
KISSY.add("event/dom/touch/tap-hold",function(b,c,d,a){function e(){}function f(a){1==a.touches.length&&a.preventDefault()}b.extend(e,d,{onTouchStart:function(c){if(!1===e.superclass.onTouchStart.call(this,c))return!1;this.timer=setTimeout(function(){var e=c.touches[0];a.fire(c.target,"tapHold",{touch:e,pageX:e.pageX,pageY:e.pageY,which:1,duration:(b.now()-c.timeStamp)/1E3})},1E3)},onTouchMove:function(){clearTimeout(this.timer);return!1},onTouchEnd:function(){clearTimeout(this.timer)}});c.tapHold=
{setup:function(){a.on(this,"touchstart",f)},tearDown:function(){a.detach(this,"touchstart",f)},handle:new e};return e},{requires:["./handle-map","./single-touch","event/dom/base"]});
KISSY.add("event/dom/touch/rotate",function(b,c,d,a,e){function f(){}function m(a){2==a.touches.length&&a.preventDefault()}var n=180/Math.PI;b.extend(f,d,{onTouchMove:function(c){if(this.isTracking){var f=c.touches,d=f[0],i=f[1],l=this.lastAngle,d=Math.atan2(i.pageY-d.pageY,i.pageX-d.pageX)*n;if(l!==e){var i=Math.abs(d-l),g=(d+360)%360,j=(d-360)%360;Math.abs(g-l)<i?d=g:Math.abs(j-l)<i&&(d=j)}this.lastTouches=f;this.lastAngle=d;this.isStarted?a.fire(this.target,"rotate",b.mix(c,{angle:d,rotation:d-
this.startAngle})):(this.isStarted=!0,this.startAngle=d,this.target=this.getCommonTarget(c),a.fire(this.target,"rotateStart",b.mix(c,{angle:d,rotation:0})))}},end:function(){this.lastAngle=e;f.superclass.end.apply(this,arguments)},fireEnd:function(c){a.fire(this.target,"rotateEnd",b.mix(c,{touches:this.lastTouches}))}});d=new f;c.rotateEnd=c.rotateStart={handle:d};c.rotate={handle:d,add:function(){a.on(this,"touchmove",m)},remove:function(){a.detach(this,"touchmove",m)}};return f},{requires:["./handle-map",
"./multi-touch","event/dom/base"]});
KISSY.add("event/dom/touch/handle",function(b,c,d,a){function e(g){return b.startsWith(g,"touch")}function f(g){return b.startsWith(g,"mouse")}function m(g){return b.startsWith(g,"MSPointer")}function n(g){this.doc=g;this.eventHandle={};this.init();this.touches=[];this.inTouch=0}var o=b.guid("touch-handle"),k=b.Features,h,i,l;k.isTouchEventSupported()?(l="touchend touchcancel mouseup",h="touchstart mousedown",i="touchmove mousemove",b.UA.ios&&(l="touchend touchcancel",h="touchstart",i="touchmove")):
k.isMsPointerSupported()?(h="MSPointerDown",i="MSPointerMove",l="MSPointerUp MSPointerCancel"):(h="mousedown",i="mousemove",l="mouseup");n.prototype={constructor:n,lastTouches:[],firstTouch:null,init:function(){var g=this.doc;a.on(g,h,this.onTouchStart,this);if(!m(i))a.on(g,i,this.onTouchMove,this);a.on(g,l,this.onTouchEnd,this)},addTouch:function(g){g.identifier=g.pointerId;this.touches.push(g)},removeTouch:function(g){for(var a=0,b=g.pointerId,c=this.touches,e=c.length;a<e;a++){g=c[a];if(g.pointerId===
b){c.splice(a,1);break}}},updateTouch:function(a){for(var j=0,b,c=a.pointerId,e=this.touches,d=e.length;j<d;j++){b=e[j];b.pointerId===c&&(e[j]=a)}},isPrimaryTouch:function(a){return this.firstTouch===a.identifier},setPrimaryTouch:function(a){if(this.firstTouch===null)this.firstTouch=a.identifier},removePrimaryTouch:function(a){if(this.isPrimaryTouch(a))this.firstTouch=null},dupMouse:function(a){var b=this.lastTouches,a=a.changedTouches[0];if(this.isPrimaryTouch(a)){var c={x:a.clientX,y:a.clientY};
b.push(c);setTimeout(function(){var a=b.indexOf(c);a>-1&&b.splice(a,1)},2500)}},isEventSimulatedFromTouch:function(a){for(var b=this.lastTouches,c=a.clientX,a=a.clientY,e=0,d=b.length,f;e<d&&(f=b[e]);e++){var i=Math.abs(c-f.x),h=Math.abs(a-f.y);if(i<=25&&h<=25)return true}return 0},normalize:function(a){var b=a.type,c;if(e(b)){c=b=="touchend"||b=="touchcancel"?a.changedTouches:a.touches;if(c.length==1){a.which=1;a.pageX=c[0].pageX;a.pageY=c[0].pageY}return a}c=this.touches;b=!b.match(/(up|cancel)$/i);
a.touches=b?c:[];a.targetTouches=b?c:[];a.changedTouches=c;return a},onTouchStart:function(b){var c,d;d=b.type;var h=this.eventHandle;if(e(d)){this.setPrimaryTouch(b.changedTouches[0]);this.dupMouse(b)}else if(f(d)){if(this.isEventSimulatedFromTouch(b))return;this.touches=[b.originalEvent]}else if(m(d)){this.addTouch(b.originalEvent);if(this.touches.length==1)a.on(this.doc,i,this.onTouchMove,this)}else throw Error("unrecognized touch event: "+b.type);for(c in h){d=h[c].handle;d.isActive=1}this.callEventHandle("onTouchStart",
b)},onTouchMove:function(a){var b=a.type;if(!e(b))if(f(b)){if(this.isEventSimulatedFromTouch(b))return;this.touches=[a.originalEvent]}else if(m(b))this.updateTouch(a.originalEvent);else throw Error("unrecognized touch event: "+a.type);this.callEventHandle("onTouchMove",a)},onTouchEnd:function(c){var j=this,d=c.type;if(!f(d)||!j.isEventSimulatedFromTouch(c)){j.callEventHandle("onTouchEnd",c);if(e(d)){j.dupMouse(c);b.makeArray(c.changedTouches).forEach(function(a){j.removePrimaryTouch(a)})}else if(f(d))j.touches=
[];else if(m(d)){j.removeTouch(c.originalEvent);j.touches.length||a.detach(j.doc,i,j.onTouchMove,j)}}},callEventHandle:function(a,b){var c=this.eventHandle,d,e,b=this.normalize(b);for(d in c){e=c[d].handle;if(!e.processed){e.processed=1;if(e.isActive&&e[a]&&e[a](b)===false)e.isActive=0}}for(d in c){e=c[d].handle;e.processed=0}},addEventHandle:function(a){var b=this.eventHandle,c=d[a].handle;b[a]?b[a].count++:b[a]={count:1,handle:c}},removeEventHandle:function(a){var b=this.eventHandle;if(b[a]){b[a].count--;
b[a].count||delete b[a]}},destroy:function(){var b=this.doc;a.detach(b,h,this.onTouchStart,this);a.detach(b,i,this.onTouchMove,this);a.detach(b,l,this.onTouchEnd,this)}};return{addDocumentHandle:function(a,b){var d=c.getDocument(a),e=c.data(d,o);e||c.data(d,o,e=new n(d));b&&e.addEventHandle(b)},removeDocumentHandle:function(a,d){var e=c.getDocument(a),f=c.data(e,o);if(f){d&&f.removeEventHandle(d);if(b.isEmptyObject(f.eventHandle)){f.destroy();c.removeData(e,o)}}}}},{requires:"dom,./handle-map,event/dom/base,./tap,./swipe,./double-tap,./pinch,./tap-hold,./rotate".split(",")});
KISSY.add("event/dom/touch",function(b,c,d,a){function e(b){a.addDocumentHandle(this,b);d[b].setup.apply(this,arguments)}function f(b){a.removeDocumentHandle(this,b);d[b].tearDown.apply(this,arguments)}function m(b){a.addDocumentHandle(this,b)}function n(b){a.removeDocumentHandle(this,b)}var b=c.Gesture,o=b.start="KSPointerDown",k=b.move="KSPointerMove",h=b.end="KSPointerUp";b.tap="tap";b.doubleTap="doubleTap";d[o]={handle:{isActive:1,onTouchStart:function(a){c.fire(a.target,o,a)}}};d[k]={setup:function(){var a=
this.ownerDocument||this;a.__ks__pointer_events_count=a.__ks__pointer_events_count||0;a.__ks__pointer_events_count++},tearDown:function(){var a=this.ownerDocument||this;a.__ks__pointer_events_count&&a.__ks__pointer_events_count--},handle:{isActive:1,onTouchMove:function(a){var b=a.target;(b.ownerDocument||b).__ks__pointer_events_count&&c.fire(b,k,a)}}};d[h]={handle:{isActive:1,onTouchEnd:function(a){c.fire(a.target,h,a)}}};var b=c.Special,i,l,g;for(l in d)i={},g=d[l],i.setup=g.setup?e:m,i.tearDown=
g.tearDown?f:n,g.add&&(i.add=g.add),g.remove&&(i.remove=g.remove),b[l]=i},{requires:["event/dom/base","./touch/handle-map","./touch/handle"]});
