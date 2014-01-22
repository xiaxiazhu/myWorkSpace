/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Sep 18 00:20
*/
KISSY.add("event/custom/observer",function(b,g){function h(){h.superclass.constructor.apply(this,arguments)}b.extend(h,g.Observer,{keys:["fn","context","groups"]});return h},{requires:["event/base"]});KISSY.add("event/custom/object",function(b,g){function h(g){h.superclass.constructor.call(this);b.mix(this,g)}b.extend(h,g.Object);return h},{requires:["event/base"]});
KISSY.add("event/custom/observable",function(b,g,h,m){function j(){j.superclass.constructor.apply(this,arguments);this.defaultFn=null;this.defaultTargetOnly=!1;this.bubbles=!0}var n=m.Utils,k=k;b.extend(j,m.Observable,{on:function(a){a=new g(a);b.Config.debug&&(a.fn||"lack event handler for "+this.type);-1==this.findObserver(a)&&this.observers.push(a)},fire:function(a){var a=a||{},d=this.bubbles,f=this.currentTarget,e,i=this.type,o=this.defaultFn,l,c=a,b;a.type=i;c instanceof h||(c.target=f,c=new h(c));
c.currentTarget=f;a=this.notify(c);!1!==b&&a!=k&&(b=a);if(d&&!c.isPropagationStopped()){e=(d=f.getTargets())&&d.length||0;for(l=0;l<e&&!c.isPropagationStopped();l++)a=d[l].fire(i,c),!1!==b&&a!==k&&(b=a)}if(o&&!c.isDefaultPrevented()&&(i=c.target,a=i.getCustomEventObservable(c.type),!this.defaultTargetOnly&&!a.defaultTargetOnly||f==i))b=o.call(f,c);return b},notify:function(a){var d=[].concat(this.observers),f,e,i=d.length,b;for(b=0;b<i&&!a.isImmediatePropagationStopped();b++)f=d[b].notify(a,this),
!1!==e&&f!==k&&(e=f);return e},detach:function(a){var d,f=a.fn,e=a.context,i=this.currentTarget,b=this.observers,a=a.groups;if(b.length){a&&(d=n.getGroupsRe(a));var l,c,h,g,j=b.length;if(f||d){e=e||i;l=a=0;for(c=[];a<j;++a)if(h=b[a],g=h.context||i,e!=g||f&&f!=h.fn||d&&!h.groups.match(d))c[l++]=h;this.observers=c}else this.reset()}}});return j},{requires:["./observer","./object","event/base"]});
KISSY.add("event/custom/target",function(b,g,h){function m(){}var j=g.Utils,n=j.splitAndRun,k=k;m.prototype={constructor:m,isTarget:1,getCustomEventObservable:function(a,d){var b,e=this.getCustomEvents();b=e&&e[a];!b&&d&&(b=e[a]=new h({currentTarget:this,type:a}));return b},fire:function(a,b){var f=this,e=k,i=f.getTargets(),g=i&&i.length,b=b||{};n(a,function(a){var c;j.fillGroupsForEvent(a,b);a=b.type;if((c=f.getCustomEventObservable(a))||g){if(c){if(!c.hasObserver()&&!c.defaultFn&&(c.bubbles&&!g||
!c.bubbles))return}else c=new h({currentTarget:f,type:a});a=c.fire(b);!1!==e&&a!==k&&(e=a)}});return e},publish:function(a,d){var f,e=this;n(a,function(a){f=e.getCustomEventObservable(a,!0);b.mix(f,d)});return e},addTarget:function(a){var d=this.getTargets();b.inArray(a,d)||d.push(a);return this},removeTarget:function(a){var d=this.getTargets(),a=b.indexOf(a,d);-1!=a&&d.splice(a,1);return this},getTargets:function(){return this["__~ks_bubble_targets"]||(this["__~ks_bubble_targets"]=[])},getCustomEvents:function(){return this["__~ks_custom_events"]||
(this["__~ks_custom_events"]={})},on:function(a,b,f){var e=this;j.batchForType(function(a,b,d){b=j.normalizeParam(a,b,d);a=b.type;if(a=e.getCustomEventObservable(a,!0))a.on(b)},0,a,b,f);return e},detach:function(a,d,f){var e=this;j.batchForType(function(a,d,f){var c=j.normalizeParam(a,d,f);(a=c.type)?(a=e.getCustomEventObservable(a,!0))&&a.detach(c):(a=e.getCustomEvents(),b.each(a,function(a){a.detach(c)}))},0,a,d,f);return e}};return m},{requires:["event/base","./observable"]});
KISSY.add("event/custom",function(b,g){return{Target:g,global:new g,targetObject:b.mix({},g.prototype,!0,function(b,g){return b=="constructor"?void 0:g})}},{requires:["./custom/target"]});