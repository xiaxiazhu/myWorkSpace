/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Sep 17 23:10
*/
KISSY.add("swf/ua",function(g,b){function q(b){var d="string"==typeof b?b.match(/\d+/g).splice(0,3):b;g.isArray(d)&&(b=parseFloat(d[0]+"."+r(d[1],3)+r(d[2],5)));return b||0}function r(b,d){var b=(b||0)+"",g=d+1-b.length;return Array(0<g?g:0).join("0")+b}function h(g){if(g||s){s=!1;var d;if(navigator.plugins&&navigator.mimeTypes.length)d=(navigator.plugins["Shockwave Flash"]||0).description;else if(l.ActiveXObject)try{d=(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")}catch(k){}n=
!d?b:d.match(/\d+/g).splice(0,3)}return n}var n,s=!0,l=g.Env.host;return{fpv:h,fpvGTE:function(b,d){return q(h(d))>=q(b)}}});
KISSY.add("swf",function(g,b,q,r,h,n){function s(a){var c=e;g.each(a,function(a,b){b=b.toLowerCase();b in C?c+=d(b,a):b==D&&(c+=d(b,B(a)))});return c}function l(a,c,b,m){var f=e,o=e;m==n&&(m=k.ie);g.each(c,function(a,c){f=f+(t+c+u+j+a+j)});m?(f+=t+"classid"+u+j+E+j,o+=d("movie",a)):(f+=t+"data"+u+j+a+j,f+=t+"type"+u+j+F+j);o+=s(b);return v+w+f+x+o}function B(a){var c=[];g.each(a,function(a,b){"string"!=typeof a&&(a=q.stringify(a));a&&c.push(b+"="+G(a))});return c.join("&")}function d(a,c){return'<param name="'+
a+'" value="'+c+'"></param>'}var k=g.UA,F="application/x-shockwave-flash",E="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",D="flashvars",e="",t=" ",u="=",j='"',v="<",x=">",H=g.Env.host.document,z=h.fpv,I=h.fpvGEQ,A=h.fpvGTE,w="object",G=encodeURIComponent,C={wmode:e,allowscriptaccess:e,allownetworking:e,allowfullscreen:e,play:"false",loop:e,menu:e,quality:e,scale:e,salign:e,bgcolor:e,devicefont:e,hasPriority:e,base:e,swliveconnect:e,seamlesstabbing:e},y;return y=r.extend({initializer:function(){var a=
this.get("expressInstall"),c,i,m=this.get("htmlMode");i=this.get("params");var f=this.get("attrs"),e=this.get("document"),d=b.create("<span>",n,e),j=this.get("elBefore"),h=this.get("src"),p=this.get("version");c=f.id=f.id||g.guid("ks-swf-");if(z()){if(p&&!A(p)&&(this.set("status",y.Status.TOO_LOW),a)){h=a;if(!("width"in f)||!/%$/.test(f.width)&&310>parseInt(f.width,10))f.width="310";if(!("height"in f)||!/%$/.test(f.height)&&137>parseInt(f.height,10))f.height="137";a=i.flashVars=i.flashVars||{};g.mix(a,
{MMredirectURL:location.href,MMplayerType:k.ie?"ActiveX":"PlugIn",MMdoctitle:e.title.slice(0,47)+" - Flash Player Installation"})}"full"==m?(k.ie?(a=l(h,f,i,1),delete f.id,delete f.style,p=l(h,f,i,0)):(p=l(h,f,i,0),delete f.id,delete f.style,a=l(h,f,i,1)),i=a+p+v+"/"+w+x+v+"/"+w+x):i=l(h,f,i,k.ie)+v+"/"+w+x;this.set("html",i);j?b.insertBefore(d,j):b.append(d,this.get("render"));"outerHTML"in d?d.outerHTML=i:d.parentNode.replaceChild(b.create(i),d);c=b.get("#"+c,e);this.set("swfObject",c);"full"==
m&&(k.ie?this.set("swfObject",c):this.set("swfObject",c.parentNode));this.set("el",c);this.get("status")||this.set("status",y.Status.SUCCESS)}else this.set("status",y.Status.NOT_INSTALLED)},callSWF:function(a,c){var b=this.get("el"),d,c=c||[];try{b[a]&&(d=b[a].apply(b,c))}catch(f){d="",0!==c.length&&(d="'"+c.join("', '")+"'"),d=(new Function("swf","return swf."+a+"("+d+");"))(b)}return d},destroy:function(){this.detach();var a=this.get("swfObject");k.ie?(a.style.display="none",function(){if(4==a.readyState){for(var b in a)"function"==
typeof a[b]&&(a[b]=null);a.parentNode.removeChild(a)}else setTimeout(arguments.callee,10)}()):a.parentNode.removeChild(a)}},{ATTRS:{expressInstall:{value:g.config("base")+"swf/assets/expressInstall.swf"},src:{},version:{value:"9"},params:{value:{}},attrs:{value:{}},render:{setter:function(a){"string"==typeof a&&(a=b.get(a,this.get("document")));return a},valueFn:function(){return document.body}},elBefore:{setter:function(a){"string"==typeof a&&(a=b.get(a,this.get("document")));return a}},document:{value:H},
status:{},el:{},swfObject:{},html:{},htmlMode:{value:"default"}},getSrc:function(a){var c=a=b.get(a),d="",e,a=[],d=b.nodeName(c);if("object"==d){(d=b.attr(c,"data"))&&a.push(c);c=c.childNodes;for(d=0;d<c.length;d++)e=c[d],1==e.nodeType&&("movie"==(b.attr(e,"name")||"").toLowerCase()?a.push(e):"embed"==b.nodeName(e)?a.push(e):"object"==b.nodeName(c[d])&&a.push(e))}else"embed"==d&&a.push(c);c=(a=a[0])&&b.nodeName(a);return"embed"==c?b.attr(a,"src"):"object"==c?b.attr(a,"data"):"param"==c?b.attr(a,"value"):
null},Status:{TOO_LOW:"flash version is too low",NOT_INSTALLED:"flash is not installed",SUCCESS:"success"},HtmlMode:{DEFAULT:"default",FULL:"full"},fpv:z,fpvGEQ:I,fpvGTE:A})},{requires:["dom","json","base","swf/ua"]});
