/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Oct 30 18:18
*/
KISSY.add("io/form-serializer",function(d,f){function j(b){return b.replace(i,"\r\n")}var l=/^(?:select|textarea)/i,i=/\r?\n/g,h,b=/^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;return h={serialize:function(b,a){return d.param(h.getFormData(b),void 0,void 0,a||!1)},getFormData:function(c){var a=[],k={};d.each(f.query(c),function(b){b=b.elements?d.makeArray(b.elements):[b];a.push.apply(a,b)});a=d.filter(a,function(a){return a.name&&!a.disabled&&
(a.checked||l.test(a.nodeName)||b.test(a.type))});d.each(a,function(b){var a=f.val(b),e;null!==a&&(a=d.isArray(a)?d.map(a,j):j(a),(e=k[b.name])?(e&&!d.isArray(e)&&(e=k[b.name]=[e]),e.push.apply(e,d.makeArray(a))):k[b.name]=a)});return k}}},{requires:["dom"]});
KISSY.add("io/base",function(d,f,j,l){function i(a){var b=a.context;delete a.context;a=d.mix(d.clone(e),a,{deep:!0});a.context=b||a;var g,h=a.type,f=a.dataType,b=a.uri=s.resolve(a.url);a.uri.setQuery("");"crossDomain"in a||(a.crossDomain=!a.uri.isSameOriginAs(s));h=a.type=h.toUpperCase();a.hasContent=!k.test(h);if(a.processData&&(g=a.data)&&"string"!=typeof g)a.data=d.param(g,l,l,a.serializeArray);f=a.dataType=d.trim(f||"*").split(c);!("cache"in a)&&d.inArray(f[0],["script","jsonp"])&&(a.cache=!1);
a.hasContent||(a.data&&b.query.add(d.unparam(a.data)),!1===a.cache&&b.query.set("_ksTS",d.now()+"_"+d.guid()));return a}function h(a){var b=this;if(!(b instanceof h))return new h(a);j.call(b);a=i(a);d.mix(b,{responseData:null,config:a||{},timeoutTimer:null,responseText:null,responseXML:null,responseHeadersString:"",responseHeaders:null,requestHeaders:{},readyState:0,state:0,statusText:null,status:0,transport:null});j.Defer(b);var e;h.fire("start",{ajaxConfig:a,io:b});e=new (g[a.dataType[0]]||g["*"])(b);
b.transport=e;a.contentType&&b.setRequestHeader("Content-Type",a.contentType);var c=a.dataType[0],s,k=a.timeout,f=a.context,l=a.headers,o=a.accepts;b.setRequestHeader("Accept",c&&o[c]?o[c]+("*"===c?"":", */*; q=0.01"):o["*"]);for(s in l)b.setRequestHeader(s,l[s]);if(a.beforeSend&&!1===a.beforeSend.call(f,b,a))return b;b.readyState=1;h.fire("send",{ajaxConfig:a,io:b});a.async&&0<k&&(b.timeoutTimer=setTimeout(function(){b.abort("timeout")},1E3*k));try{b.state=1,e.send()}catch(q){2>b.state?(q.stack||
q,b._ioReady(-1,q.message)):q}return b}var b=/^(?:about|app|app\-storage|.+\-extension|file|widget)$/,c=/\s+/,a=function(a){return a},k=/^(?:GET|HEAD)$/,s=new d.Uri((d.Env.host.location||{}).href),b=s&&b.test(s.getScheme()),g={},e={type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",async:!0,serializeArray:!0,processData:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},converters:{text:{json:d.parseJson,
html:a,text:a,xml:d.parseXML}},headers:{"X-Requested-With":"XMLHttpRequest"},contents:{xml:/xml/,html:/html/,json:/json/}};e.converters.html=e.converters.text;d.mix(h,f.targetObject);d.mix(h,{isLocal:b,setupConfig:function(a){d.mix(e,a,{deep:!0})},setupTransport:function(a,b){g[a]=b},getTransport:function(a){return g[a]},getConfig:function(){return e}});return h},{requires:["event/custom","promise"]});
KISSY.add("io/xhr-transport-base",function(d,f){function j(a,b){try{return new (b||i).XMLHttpRequest}catch(e){}}function l(a){var b;a.ifModified&&(b=a.uri,!1===a.cache&&(b=b.clone(),b.query.remove("_ksTS")),b=b.toString());return b}var i=d.Env.host,h=7<d.UA.ie&&i.XDomainRequest,b={proto:{}},c={},a={};f.__lastModifiedCached=c;f.__eTagCached=a;b.nativeXhr=i.ActiveXObject?function(a,b){var e;if(!k&&a&&h)e=new h;else if(!(e=!f.isLocal&&j(a,b)))a:{try{e=new (b||i).ActiveXObject("Microsoft.XMLHTTP");break a}catch(c){}e=
void 0}return e}:j;b._XDomainRequest=h;var k=b.supportCORS="withCredentials"in b.nativeXhr();d.mix(b.proto,{sendInternal:function(){var b=this,g=b.io,e=g.config,m=b.nativeXhr,f=e.files,j=f?"post":e.type,i=e.async,n,w=g.mimeType,u=g.requestHeaders||{},g=g._getUrlForSend(),p;p=l(e);var o,q;if(p){if(o=c[p])u["If-Modified-Since"]=o;if(o=a[p])u["If-None-Match"]=o}p=e.xhrFields||{};"withCredentials"in p&&(k||delete p.withCredentials);(n=e.username)?m.open(j,g,i,n,e.password):m.open(j,g,i);for(q in p)try{m[q]=
p[q]}catch(x){x}w&&m.overrideMimeType&&m.overrideMimeType(w);!1===u["X-Requested-With"]&&delete u["X-Requested-With"];if("undefined"!==typeof m.setRequestHeader)for(q in u)m.setRequestHeader(q,u[q]);var v=e.hasContent&&e.data||null;f&&(j=v,n={},j&&(n=d.unparam(j)),n=d.mix(n,f),v=new FormData,d.each(n,function(a,b){d.isArray(a)?d.each(a,function(a){v.append(b+(e.serializeArray?"[]":""),a)}):v.append(b,a)}));m.send(v);!i||4==m.readyState?b._callback():h&&m instanceof h?(m.onload=function(){m.readyState=
4;m.status=200;b._callback()},m.onerror=function(){m.readyState=4;m.status=500;b._callback()}):m.onreadystatechange=function(){b._callback()}},abort:function(){this._callback(0,1)},_callback:function(b,g){var e=this.nativeXhr,k=this.io,j,i,r,n,w,u=k.config;try{if(g||4==e.readyState)if(h&&e instanceof h?(e.onerror=d.noop,e.onload=d.noop):e.onreadystatechange=d.noop,g)4!==e.readyState&&e.abort();else{j=l(u);var p=e.status;h&&e instanceof h||(k.responseHeadersString=e.getAllResponseHeaders());j&&(i=
e.getResponseHeader("Last-Modified"),r=e.getResponseHeader("ETag"),i&&(c[j]=i),r&&(a[r]=r));if((w=e.responseXML)&&w.documentElement)k.responseXML=w;var o=k.responseText=e.responseText;if(u.files&&o){var q,x;if(-1!=(q=o.indexOf("<body>")))x=o.lastIndexOf("</body>"),-1==x&&(x=o.length),o=o.slice(q+6,x);k.responseText=d.unEscapeHtml(o)}try{n=e.statusText}catch(v){"xhr statusText error: ",v,n=""}!p&&f.isLocal&&!u.crossDomain?p=k.responseText?200:404:1223===p&&(p=204);k._ioReady(p,n)}}catch(z){e.onreadystatechange=
d.noop,g||k._ioReady(-1,z)}}});return b},{requires:["./base"]});
KISSY.add("io/sub-domain-transport",function(d,f,j,l){function i(a){var b=a.config;this.io=a;b.crossDomain=!1;"use SubDomainTransport for: "+b.url}function h(){var a=this.io.config.uri.getHostname(),a=c[a];a.ready=1;j.detach(a.iframe,"load",h,this);this.send()}var b=d.Env.host.document,c={};d.augment(i,f.proto,{send:function(){var a=this.io.config,k=a.uri,s=k.getHostname(),g;g=c[s];var e="/sub_domain_proxy.html";a.xdr&&a.xdr.subDomain&&a.xdr.subDomain.proxy&&(e=a.xdr.subDomain.proxy);g&&g.ready?(this.nativeXhr=
f.nativeXhr(0,g.iframe.contentWindow))?this.sendInternal():"document.domain not set correctly!":(g?a=g.iframe:(g=c[s]={},a=g.iframe=b.createElement("iframe"),l.css(a,{position:"absolute",left:"-9999px",top:"-9999px"}),l.prepend(a,b.body||b.documentElement),g=new d.Uri,g.setScheme(k.getScheme()),g.setPort(k.getPort()),g.setHostname(s),g.setPath(e),a.src=g.toString()),j.on(a,"load",h,this))}});return i},{requires:["./xhr-transport-base","event","dom"]});
KISSY.add("io/xdr-flash-transport",function(d,f,j){function l(c,g,e){k||(k=!0,c='<object id="'+b+'" type="application/x-shockwave-flash" data="'+c+'" width="0" height="0"><param name="movie" value="'+c+'" /><param name="FlashVars" value="yid='+g+"&uid="+e+'&host=KISSY.IO" /><param name="allowScriptAccess" value="always" /></object>',g=a.createElement("div"),j.prepend(g,a.body||a.documentElement),g.innerHTML=c)}function i(a){"use XdrFlashTransport for: "+a.config.url;this.io=a}var h={},b="io_swf",
c,a=d.Env.host.document,k=!1;d.augment(i,{send:function(){var a=this,b=a.io,e=b.config;l((e.xdr||{}).src||d.Config.base+"io/assets/io.swf",1,1);c?(a._uid=d.guid(),h[a._uid]=a,c.send(b._getUrlForSend(),{id:a._uid,uid:a._uid,method:e.type,data:e.hasContent&&e.data||{}})):setTimeout(function(){a.send()},200)},abort:function(){c.abort(this._uid)},_xdrResponse:function(a,b){var e,c=b.id,k,d=b.c,f=this.io;if(d&&(k=d.responseText))f.responseText=decodeURI(k);switch(a){case "success":e={status:200,statusText:"success"};
delete h[c];break;case "abort":delete h[c];break;case "timeout":case "transport error":case "failure":delete h[c],e={status:"status"in d?d.status:500,statusText:d.statusText||a}}e&&f._ioReady(e.status,e.statusText)}});f.applyTo=function(a,b,e){var a=b.split(".").slice(1),c=f;d.each(a,function(a){c=c[a]});c.apply(null,e)};f.xdrReady=function(){c=a.getElementById(b)};f.xdrResponse=function(a,b){var c=h[b.uid];c&&c._xdrResponse(a,b)};return i},{requires:["./base","dom"]});
KISSY.add("io/xhr-transport",function(d,f,j,l,i){function h(a){var k=a.config,f=k.crossDomain,g=k.xdr||{},e=g.subDomain=g.subDomain||{};this.io=a;if(f&&!j.supportCORS){var h=k.uri.getHostname();if(b.domain&&d.endsWith(h,b.domain)&&!1!==e.proxy)return new l(a);if("flash"===""+g.use||!c)return new i(a)}a=this.nativeXhr=j.nativeXhr(f);"crossDomain: "+f+", use "+(c&&a instanceof c?"XDomainRequest":"XhrTransport")+" for: "+k.url;return this}var b=d.Env.host.document,c=j._XDomainRequest;d.augment(h,j.proto,
{send:function(){this.sendInternal()}});f.setupTransport("*",h);return f},{requires:["./base","./xhr-transport-base","./sub-domain-transport","./xdr-flash-transport"]});
KISSY.add("io/script-transport",function(d,f,j,l){function i(b){var a=b.config;if(!a.crossDomain)return new (f.getTransport("*"))(b);this.io=b;"use ScriptTransport for: "+a.url;return this}var h=d.Env.host,b=h.document;f.setupConfig({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{text:{script:function(b){d.globalEval(b);return b}}}});d.augment(i,{send:function(){var c=this,a,k=c.io,
d=k.config,g=b.head||b.getElementsByTagName("head")[0]||b.documentElement;c.head=g;a=b.createElement("script");c.script=a;a.async=!0;d.scriptCharset&&(a.charset=d.scriptCharset);a.src=k._getUrlForSend();a.onerror=a.onload=a.onreadystatechange=function(a){a=a||h.event;c._callback((a.type||"error").toLowerCase())};g.insertBefore(a,g.firstChild)},_callback:function(b,a){var k=this.script,d=this.io,g=this.head;if(k&&(a||!k.readyState||/loaded|complete/.test(k.readyState)||"error"==b))k.onerror=k.onload=
k.onreadystatechange=null,g&&k.parentNode&&g.removeChild(k),this.head=this.script=l,!a&&"error"!=b?d._ioReady(200,"success"):"error"==b&&d._ioReady(500,"script error")},abort:function(){this._callback(0,1)}});f.setupTransport("script",i);return f},{requires:["./base","./xhr-transport"]});
KISSY.add("io/jsonp",function(d,f){var j=d.Env.host;f.setupConfig({jsonp:"callback",jsonpCallback:function(){return d.guid("jsonp")}});f.on("start",function(f){var i=f.io,h=i.config,f=h.dataType;if("jsonp"==f[0]){delete h.contentType;var b,c=h.jsonpCallback,a="function"===typeof c?c():c,k=j[a];h.uri.query.set(h.jsonp,a);j[a]=function(a){1<arguments.length&&(a=d.makeArray(arguments));b=[a]};i.fin(function(){j[a]=k;if(void 0===k)try{delete j[a]}catch(c){}else b&&k(b[0])});i=h.converters;i.script=i.script||
{};i.script.json=function(){b||" not call jsonpCallback: "+a;return b[0]};f.length=2;f[0]="script";f[1]="json"}});return f},{requires:["./base"]});
KISSY.add("io/form",function(d,f,j,l){var i=Array.prototype.slice,h=d.Env.host.FormData;f.on("start",function(b){var c,a,b=b.io.config;if(a=b.form){c=j.get(a);a=b.data;for(var k=!1,f={},g=j.query("input",c),e=0,m=g.length;e<m;e++){var y=g[e];if("file"==y.type.toLowerCase()){k=!0;if(!h)break;var t=i.call(y.files,0);f[j.attr(y,"name")]=1<t.length?t:t[0]||null}}k&&h&&(b.files=b.files||{},d.mix(b.files,f),delete b.contentType);!k||h?(c=l.getFormData(c),b.hasContent?(c=d.param(c,void 0,void 0,b.serializeArray),
b.data=a?b.data+("&"+c):c):b.uri.query.add(c)):(a=b.dataType,b=a[0],"*"==b&&(b="text"),a.length=2,a[0]="iframe",a[1]=b)}});return f},{requires:["./base","dom","./form-serializer"]});
KISSY.add("io/iframe-transport",function(d,f,j,l){function i(a){var b=d.guid("io-iframe"),g=f.getEmptyIframeSrc(),a=a.iframe=f.create("<iframe "+(g?' src="'+g+'" ':"")+' id="'+b+'" name="'+b+'" style="position:absolute;left:-9999px;top:-9999px;"/>');f.prepend(a,c.body||c.documentElement);return a}function h(a,b,g){var e=[],h,j,i,l;d.each(a,function(a,k){h=d.isArray(a);j=d.makeArray(a);for(i=0;i<j.length;i++)l=c.createElement("input"),l.type="hidden",l.name=k+(h&&g?"[]":""),l.value=j[i],f.append(l,
b),e.push(l)});return e}function b(a){this.io=a;"use IframeTransport for: "+a.config.url}var c=d.Env.host.document,a=d.clone(l.getConfig().converters.text);a.json=function(a){return d.parseJson(d.unEscapeHtml(a))};l.setupConfig({converters:{iframe:a,text:{iframe:function(a){return a}},xml:{iframe:function(a){return a}}}});d.augment(b,{send:function(){function a(){j.on(l,"load error",b._callback,b);n.submit()}var b=this,c=b.io,e=c.config,m,l,t,r=e.data,n=f.get(e.form);b.attrs={target:f.attr(n,"target")||
"",action:f.attr(n,"action")||"",encoding:f.attr(n,"encoding"),enctype:f.attr(n,"enctype"),method:f.attr(n,"method")};b.form=n;l=i(c);f.attr(n,{target:l.id,action:c._getUrlForSend(),method:"post",enctype:"multipart/form-data",encoding:"multipart/form-data"});r&&(t=d.unparam(r));t&&(m=h(t,n,e.serializeArray));b.fields=m;6==d.UA.ie?setTimeout(a,0):a()},_callback:function(a){var b=this,c=b.form,e=b.io,a=a.type,h,i=e.iframe;if(i)if("abort"==a&&6==d.UA.ie?setTimeout(function(){f.attr(c,b.attrs)},0):f.attr(c,
b.attrs),f.remove(this.fields),j.detach(i),setTimeout(function(){f.remove(i)},30),e.iframe=null,"load"==a)try{if((h=i.contentWindow.document)&&h.body)e.responseText=f.html(h.body),d.startsWith(e.responseText,"<?xml")&&(e.responseText=void 0);e.responseXML=h&&h.XMLDocument?h.XMLDocument:h;h?e._ioReady(200,"success"):e._ioReady(500,"parser error")}catch(l){e._ioReady(500,"parser error")}else"error"==a&&e._ioReady(500,"error")},abort:function(){this._callback({type:"abort"})}});l.setupTransport("iframe",
b);return l},{requires:["dom","event","./base"]});
KISSY.add("io/methods",function(d,f,j,l){function i(b){var c=b.responseText,a=b.responseXML,f=b.config,h=f.converters,g,e,j=f.contents,i=f.dataType;if(c||a){for(f=b.mimeType||b.getResponseHeader("Content-Type");"*"==i[0];)i.shift();if(!i.length)for(g in j)if(j[g].test(f)){i[0]!=g&&i.unshift(g);break}i[0]=i[0]||"text";for(g=0;g<i.length;g++)if("text"==i[g]&&c!==l){e=c;break}else if("xml"==i[g]&&a!==l){e=a;break}if(!e){var t={text:c,xml:a};d.each(["text","xml"],function(b){var d=i[0];return h[b]&&h[b][d]&&
t[b]?(i.unshift(b),e="text"==b?c:a,!1):l})}}j=i[0];for(f=1;f<i.length;f++){g=i[f];var r=h[j]&&h[j][g];if(!r)throw"no covert for "+j+" => "+g;e=r(e);j=g}b.responseData=e}var h=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg;d.extend(f,j,{setRequestHeader:function(b,c){this.requestHeaders[b]=c;return this},getAllResponseHeaders:function(){return 2===this.state?this.responseHeadersString:null},getResponseHeader:function(b){var c,a;if(2===this.state){if(!(a=this.responseHeaders))for(a=this.responseHeaders={};c=h.exec(this.responseHeadersString);)a[c[1]]=
c[2];c=a[b]}return c===l?null:c},overrideMimeType:function(b){this.state||(this.mimeType=b);return this},abort:function(b){b=b||"abort";this.transport&&this.transport.abort(b);this._ioReady(0,b);return this},getNativeXhr:function(){var b;return(b=this.transport)?b.nativeXhr:null},_ioReady:function(b,c){if(2!=this.state){this.state=2;this.readyState=4;var a;if(200<=b&&300>b||304==b)if(304==b)c="not modified",a=!0;else try{i(this),c="success",a=!0}catch(d){d.stack||d,c="parser error"}else 0>b&&(b=0);
this.status=b;this.statusText=c;var h=this.defer,g=this.config,e;if(e=this.timeoutTimer)clearTimeout(e),this.timeoutTimer=0;e=a?"success":"error";var j,l=[this.responseData,c,this],t=g.context,r={ajaxConfig:g,io:this};(j=g[e])&&j.apply(t,l);(j=g.complete)&&j.apply(t,l);f.fire(e,r);f.fire("complete",r);h[a?"resolve":"reject"](l)}},_getUrlForSend:function(){var b=this.config,c=b.uri,a=d.Uri.getComponents(b.url).query||"";return c.toString.call(c,b.serializeArray)+(a?(c.query.has()?"&":"?")+a:a)}})},
{requires:["./base","promise"]});
KISSY.add("io",function(d,f,j){function l(d,b,c,a,f){"function"===typeof b&&(a=c,c=b,b=i);return j({type:f||"get",url:d,data:b,success:c,dataType:a})}var i=void 0;d.mix(j,{serialize:f.serialize,get:l,post:function(d,b,c,a){"function"===typeof b&&(a=c,c=b,b=i);return l(d,b,c,a,"post")},jsonp:function(d,b,c){"function"===typeof b&&(c=b,b=i);return l(d,b,c,"jsonp")},getScript:d.getScript,getJSON:function(d,b,c){"function"===typeof b&&(c=b,b=i);return l(d,b,c,"json")},upload:function(d,b,c,a,f){"function"===
typeof c&&(f=a,a=c,c=i);return j({url:d,type:"post",dataType:f,form:b,data:c,success:a})}});d.mix(d,{Ajax:j,IO:j,ajax:j,io:j,jsonp:j.jsonp});return j},{requires:"io/form-serializer,io/base,io/xhr-transport,io/script-transport,io/jsonp,io/form,io/iframe-transport,io/methods".split(",")});
