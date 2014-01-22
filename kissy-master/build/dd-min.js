/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Sep 17 22:59
*/
KISSY.add("dd/ddm",function(i,g,k,h){function j(f){var a,d;if(f.touches&&1<f.touches.length)o._end();else{if(a=this.__activeToDrag)a._move(f);else if(d=this.get("activeDrag"))d._move(f),this.__needDropCheck&&b(this,f,d);(a=a||d)&&a.get("preventDefaultOnMove")&&f.preventDefault()}}function b(f,b,d){var c=f.get("validDrops"),r=d.get("mode"),e=0,m=0,g=l(d.get("node")),n=p(g);i.each(c,function(f){if(f.get("disabled"))return h;var c;c=f.getNodeFromTarget(b,d.get("dragNode")[0],d.get("node")[0]);if(!c)return h;
if("point"==r)t(l(c),d.mousePos)&&(c=p(l(c)),e?c<m&&(e=f,m=c):(e=f,m=c));else if("intersect"==r)c=p(a(g,l(c))),c>m&&(m=c,e=f);else if("strict"==r&&(c=p(a(g,l(c))),c==n))return e=f,!1;return h});if((c=f.get("activeDrop"))&&c!=e)c._handleOut(b),d._handleOut(b);f.setInternal("activeDrop",e);e&&(c!=e?e._handleEnter(b):e._handleOver(b))}function e(f){f._shim=u('<div style="background-color:red;position:'+(v?"absolute":"fixed")+";left:0;width:100%;height:100%;top:0;cursor:"+o.get("dragCursor")+";z-index:"+
B+';"></div>').prependTo(q.body||q.documentElement).css("opacity",0);e=d;if(v)C.on("resize scroll",w,f);d(f)}function d(f){var a=f.get("activeDrag").get("activeHandler"),c="auto";a&&(c=a.css("cursor"));"auto"==c&&(c=f.get("dragCursor"));f._shim.css({cursor:c,display:"block"});v&&w.call(f)}function m(f){var a=f.get("drops");f.setInternal("validDrops",[]);a.length&&i.each(a,function(f){f._active()})}function n(f){var a=f.get("drops");f.setInternal("validDrops",[]);a.length&&i.each(a,function(f){f._deActive()})}
function l(f){var a=f.offset();f.__dd_cached_width||("no cache in dd!",f[0]);return{left:a.left,right:a.left+(f.__dd_cached_width||f.outerWidth()),top:a.top,bottom:a.top+(f.__dd_cached_height||f.outerHeight())}}function t(f,a){return f.left<=a.left&&f.right>=a.left&&f.top<=a.top&&f.bottom>=a.top}function p(a){return a.top>=a.bottom||a.left>=a.right?0:(a.right-a.left)*(a.bottom-a.top)}function a(a,c){var b=Math.max(a.top,c.top),d=Math.min(a.right,c.right),e=Math.min(a.bottom,c.bottom);return{left:Math.max(a.left,
c.left),right:d,top:b,bottom:e}}function c(a){a&&(a.__dd_cached_width=a.outerWidth(),a.__dd_cached_height=a.outerHeight())}var r=i.UA,u=g.all,x=i.Env.host,q=x.document,s=u(q),C=u(x),v=6===r.ie,B=999999,g=g.Gesture,y=g.move,z=g.end,k=k.extend({__activeToDrag:0,_regDrop:function(a){this.get("drops").push(a)},_unRegDrop:function(a){var c=this.get("drops"),a=i.indexOf(a,c);-1!=a&&c.splice(a,1)},_regToDrag:function(a){this.__activeToDrag=a;s.on(z,this._end,this);s.on(y,A,this);q.body.setCapture&&q.body.setCapture()},
_start:function(){this.get("drops");var a=this.__activeToDrag;a&&(this.setInternal("activeDrag",a),this.__activeToDrag=0,a.get("shim")&&e(this),this.__needDropCheck=0,a.get("groups")&&(m(this),this.get("validDrops").length&&(c(a.get("node")),this.__needDropCheck=1)))},_addValidDrop:function(a){this.get("validDrops").push(a)},_end:function(a){var c=this.__activeToDrag,b=this.get("activeDrag"),d=this.get("activeDrop");a&&(c&&c._move(a),b&&b._move(a));s.detach(y,A,this);s.detach(z,this._end,this);q.body.releaseCapture&&
q.body.releaseCapture();c&&(c._end(a),this.__activeToDrag=0);this._shim&&this._shim.hide();b&&(b._end(a),n(this),d&&d._end(a),this.setInternal("activeDrag",null),this.setInternal("activeDrop",null))}},{ATTRS:{dragCursor:{value:"move"},clickPixelThresh:{value:3},bufferTime:{value:1},activeDrag:{},activeDrop:{},drops:{value:[]},validDrops:{value:[]}}}),A=r.ie?i.throttle(j,30):j,w=i.throttle(function(){var a;(a=this.get("activeDrag"))&&a.get("shim")&&this._shim.css({width:s.width(),height:s.height()})},
30),o=new k;o.inRegion=t;o.region=l;o.area=p;o.cacheWH=c;o.PREFIX_CLS="ks-dd-";return o},{requires:["node","base"]});
KISSY.add("dd/draggable",function(i,g,k,h){function j(){return!1}var b=g.all,e=i.each,d=i.Features,m=i.UA.ie,n=h.PREFIX_CLS,l=i.Env.host.document,t,p=function(a){var c=a.target;this._checkDragStartValid(a)&&this._checkHandler(c)&&this._prepare(a)};return k.extend({initializer:function(){this.addTarget(h);this._allowMove=this.get("move")},_onSetNode:function(a){this.setInternal("dragNode",a);this.bindDragEvent()},bindDragEvent:function(){this.get("node").on(g.Gesture.start,p,this).on("dragstart",this._fixDragStart)},
detachDragEvent:function(a){a=this;a.get("node").detach(g.Gesture.start,p,a).detach("dragstart",a._fixDragStart)},_bufferTimer:null,_onSetDisabledChange:function(a){this.get("dragNode")[a?"addClass":"removeClass"](n+"-disabled")},_fixDragStart:function(a){a.preventDefault()},_checkHandler:function(a){var c=this,b=c.get("handlers"),d=0;e(b,function(b){if(b[0]==a||b.contains(a))return d=1,c.setInternal("activeHandler",b),!1});return d},_checkDragStartValid:function(a){return this.get("primaryButtonOnly")&&
1!=a.which||this.get("disabled")?0:1},_prepare:function(a){if(a){var c=this;m&&(t=l.body.onselectstart,l.body.onselectstart=j);c.get("halt")&&a.stopPropagation();d.isTouchEventSupported()||a.preventDefault();var b=a.pageX,e=a.pageY;c.setInternal("startMousePos",c.mousePos={left:b,top:e});if(c._allowMove){var g=c.get("node").offset();c.setInternal("startNodePos",g);c.setInternal("deltaPos",{left:b-g.left,top:e-g.top})}h._regToDrag(c);if(b=c.get("bufferTime"))c._bufferTimer=setTimeout(function(){c._start(a)},
1E3*b)}},_clearBufferTimer:function(){this._bufferTimer&&(clearTimeout(this._bufferTimer),this._bufferTimer=0)},_move:function(a){var c=a.pageX,b=a.pageY;if(!this.get("dragging")){var d=this.get("startMousePos"),e=0,m=this.get("clickPixelThresh");if(Math.abs(c-d.left)>=m||Math.abs(b-d.top)>=m)this._start(a),e=1;if(!e)return}this.mousePos={left:c,top:b};a={drag:this,left:c,top:b,pageX:c,pageY:b,domEvent:a};if(d=this._allowMove)e=this.get("deltaPos"),c-=e.left,b-=e.top,a.left=c,a.top=b,this.setInternal("actualPos",
{left:c,top:b}),this.fire("dragalign",a);b=1;!1===this.fire("drag",a)&&(b=0);b&&d&&this.get("node").offset(this.get("actualPos"))},stopDrag:function(){h._end()},_end:function(a){var a=a||{},b;this._clearBufferTimer();m&&(l.body.onselectstart=t);this.get("dragging")&&(this.get("node").removeClass(n+"drag-over"),(b=h.get("activeDrop"))?this.fire("dragdrophit",{drag:this,drop:b}):this.fire("dragdropmiss",{drag:this}),this.setInternal("dragging",0),this.fire("dragend",{drag:this,pageX:a.pageX,pageY:a.pageY}))},
_handleOut:function(){this.get("node").removeClass(n+"drag-over");this.fire("dragexit",{drag:this,drop:h.get("activeDrop")})},_handleEnter:function(a){this.get("node").addClass(n+"drag-over");this.fire("dragenter",a)},_handleOver:function(a){this.fire("dragover",a)},_start:function(a){this._clearBufferTimer();this.setInternal("dragging",1);this.setInternal("dragStartMousePos",{left:a.pageX,top:a.pageY});h._start();this.fire("dragstart",{drag:this,pageX:a.pageX,pageY:a.pageY})},destructor:function(){this.detachDragEvent();
this.detach()}},{name:"Draggable",ATTRS:{node:{setter:function(a){if(!(a instanceof g))return b(a)}},clickPixelThresh:{valueFn:function(){return h.get("clickPixelThresh")}},bufferTime:{valueFn:function(){return h.get("bufferTime")}},dragNode:{},shim:{value:!1},handlers:{value:[],getter:function(a){var c=this;a.length||(a[0]=c.get("node"));e(a,function(d,e){"function"===typeof d&&(d=d.call(c));"string"==typeof d&&(d=c.get("node").one(d));d.nodeType&&(d=b(d));a[e]=d});c.setInternal("handlers",a);return a}},
activeHandler:{},dragging:{value:!1,setter:function(a){this.get("dragNode")[a?"addClass":"removeClass"](n+"dragging")}},mode:{value:"point"},disabled:{value:!1},move:{value:!1},primaryButtonOnly:{value:!0},halt:{value:!0},groups:{value:!0},startMousePos:{},dragStartMousePos:{},startNodePos:{},deltaPos:{},actualPos:{},preventDefaultOnMove:{value:!0}},inheritedStatics:{DropMode:{POINT:"point",INTERSECT:"intersect",STRICT:"strict"}}})},{requires:["node","base","./ddm"]});
KISSY.add("dd/draggable-delegate",function(i,g,k,h){var j=g.PREFIX_CLS,b=h.all,e=function(d){var e,g;if(this._checkDragStartValid(d)){e=this.get("handlers");var h=b(d.target);(e=e.length?this._getHandler(h):h)&&(g=this._getNode(e));g&&(this.setInternal("activeHandler",e),this.setInternal("node",g),this.setInternal("dragNode",g),this._prepare(d))}};return k.extend({_onSetNode:function(){},_onSetContainer:function(){this.bindDragEvent()},_onSetDisabledChange:function(b){this.get("container")[b?"addClass":
"removeClass"](j+"-disabled")},bindDragEvent:function(){this.get("container").on(h.Gesture.start,e,this).on("dragstart",this._fixDragStart)},detachDragEvent:function(){this.get("container").detach(h.Gesture.start,e,this).detach("dragstart",this._fixDragStart)},_getHandler:function(b){for(var e=void 0,g=this.get("container"),h=this.get("handlers");b&&b[0]!==g[0];){i.each(h,function(g){if(b.test(g))return e=b,!1});if(e)break;b=b.parent()}return e},_getNode:function(b){return b.closest(this.get("selector"),
this.get("container"))}},{ATTRS:{container:{setter:function(e){return b(e)}},selector:{},handlers:{value:[],getter:0}}})},{requires:["./ddm","./draggable","node"]});
KISSY.add("dd/droppable",function(i,g,k,h){var j=h.PREFIX_CLS;return k.extend({initializer:function(){this.addTarget(h);h._regDrop(this)},getNodeFromTarget:function(b,e,d){var b=this.get("node"),g=b[0];return g==e||g==d?null:b},_active:function(){var b=h.get("activeDrag"),e=this.get("node"),d=this.get("groups"),b=b.get("groups");a:if(!0===b)d=1;else{for(var g in d)if(b[g]){d=1;break a}d=0}d?(h._addValidDrop(this),e&&(e.addClass(j+"drop-active-valid"),h.cacheWH(e))):e&&e.addClass(j+"drop-active-invalid")},
_deActive:function(){var b=this.get("node");b&&b.removeClass(j+"drop-active-valid").removeClass(j+"drop-active-invalid")},__getCustomEvt:function(b){return i.mix({drag:h.get("activeDrag"),drop:this},b)},_handleOut:function(){var b=this.__getCustomEvt();this.get("node").removeClass(j+"drop-over");this.fire("dropexit",b)},_handleEnter:function(b){b=this.__getCustomEvt(b);b.drag._handleEnter(b);this.get("node").addClass(j+"drop-over");this.fire("dropenter",b)},_handleOver:function(b){b=this.__getCustomEvt(b);
b.drag._handleOver(b);this.fire("dropover",b)},_end:function(){var b=this.__getCustomEvt();this.get("node").removeClass(j+"drop-over");this.fire("drophit",b)},destructor:function(){h._unRegDrop(this)}},{name:"Droppable",ATTRS:{node:{setter:function(b){if(b)return g.one(b)}},groups:{value:{}},disabled:{}}})},{requires:["node","base","./ddm"]});
KISSY.add("dd/droppable-delegate",function(i,g,k,h){function j(){var b=this.get("container"),d=[],h=this.get("selector");b.all(h).each(function(b){g.cacheWH(b);d.push(b)});this.__allNodes=d}var b=k.extend({initializer:function(){g.on("dragstart",j,this)},getNodeFromTarget:function(b,d,h){var j={left:b.pageX,top:b.pageY},b=this.__allNodes,l=0,k=Number.MAX_VALUE;b&&i.each(b,function(b){var a=b[0];a===h||a===d||(a=g.region(b),g.inRegion(a,j)&&(a=g.area(a),a<k&&(k=a,l=b)))});l&&(this.setInternal("lastNode",
this.get("node")),this.setInternal("node",l));return l},_handleOut:function(){this.callSuper();this.setInternal("node",0);this.setInternal("lastNode",0)},_handleOver:function(e){var d=this.get("node"),g=b.superclass._handleOut,h=this.callSuper,i=b.superclass._handleEnter,j=this.get("lastNode");j[0]!==d[0]?(this.setInternal("node",j),g.apply(this,arguments),this.setInternal("node",d),i.call(this,e)):h.call(this,e)},_end:function(b){this.callSuper(b);this.setInternal("node",0)}},{ATTRS:{lastNode:{},
selector:{},container:{setter:function(b){return h.one(b)}}}});return b},{requires:["./ddm","./droppable","node"]});KISSY.add("dd",function(i,g,k,h,j,b){i={Draggable:k,DDM:g,Droppable:j,DroppableDelegate:b,DraggableDelegate:h};return KISSY.DD=i},{requires:["dd/ddm","dd/draggable","dd/draggable-delegate","dd/droppable","dd/droppable-delegate"]});