KISSY.add(function(c,b,a){var f="",e=b.all;function d(h){var g=this;d.superclass.constructor.call(g,h)}c.extend(d,a,{afterUploaderRender:function(){var h=this;var g=h.get("queue");g.on("add",h._addFileHandler,h);g.on("remove",function(){h._changeText()});var i=h.get("button");var j=e(i.get("target")).text();h.set("defaultText",j)},_addFileHandler:function(j){var h=this,i=j.file,g=e(".J_Del_"+i.id);g.data("data-file",i);g.on("click",h._delHandler,h)},_getStatusWrapper:function(g){return g&&g.all(".J_FileStatus")||e("")},_waitingHandler:function(n){var o=this;var m=n.uploader;var l=m.get("type");if(l=="ajax"){var k=o.get("oPlugin").preview;var j=n.file;var i=j.id;var g=e(".J_Pic_"+i);g.show();var h=new k();h.show(j.data,g)}},_startHandler:function(n){var q=this,k=n.uploader,m=n.index,l=q.get("queue"),h=k.get("type"),g=n.file,i=e(".J_ProgressBar_"+n.id);var o=e(".J_Mask_"+n.id);o.show();if(h=="ajax"||h=="flash"){var p=q.get("oPlugin").progressBar,j;if(p){j=new p(i);j.on("change",function(r){if(r.value==100){c.later(function(){j.hide();q._setDisplayMask(false,g);g.statusWrapper.hide()},500)}});j.render();q.set("progressBar",j)}l.updateFile(m,{progressBar:j})}},_progressHandler:function(j){var h=j.file,g=j.loaded,i=j.total,l=Math.ceil((g/i)*100),k=h.progressBar;if(!k){return false}k.set("value",l)},_successHandler:function(j){var h=this,i=j.file,l=i.id,g=i.result,k=i.progressBar;if(g){h._changeImageSrc(j.id,g)}h._changeText();if(!k){e(".J_ProgressBar_"+l).hide();h._setDisplayMask(false,j.file);i.statusWrapper.hide();return false}else{k.set("value",100)}},_errorHandler:function(i){var h=this,j=i.msg,k=i.id;var g=h.get("queue");c.log(j);if(i.rule=="max"||i.rule=="required"){return false}e(".J_ErrorMsg_"+k).html("上传失败");c.later(function(){alert(j);g.remove(k)},1000)},_setDisplayMask:function(g,h){if(!h){return false}var i=e(".J_Mask_"+h.id);i[g&&"show"||"hide"]();if(g){i.show()}else{i.hide()}},_delHandler:function(l){var i=this,m=i.get("uploader"),g=i.get("queue"),k=e(l.target).data("data-file"),j=g.getFileIndex(k.id),h=k.status;if(h=="start"||h=="progress"){m.cancel(j)}},getFilesLen:function(h){if(!h){h="success"}var i=this,g=i.get("queue"),j=g.getFiles(h);return j.length},_changeImageSrc:function(k,g){var j=g.data,h,i=e(".J_Pic_"+k);if(!c.isObject(j)){return false}h=j.sUrl||j.url;if(i.attr("src")==f||c.UA.safari){i.show();i.attr("src",h)}},_changeText:function(){var o=this;var i=o.getFilesLen();var h=o.get("auth");var g=o.get("button");var m=g.get("target").children("span");var k=o.get("maxText");var l=o.get("defaultText");if(!h){return false}var n=h.get("rules"),j=n.max;if(!j){return false}if(Number(j[0])<=i){m.text(c.substitute(k,{max:j[0]}))}else{m.text(l)}}},{ATTRS:{name:{value:"refundUploader"},cssUrl:{value:"gallery/form/1.3/uploader/themes/refundUploader/style.css"},fileTpl:{value:'<li id="queue-file-{id}" class="g-u" data-name="{name}"><div class="pic-wrapper"><div class="pic"><span><img class="J_Pic_{id}" src="" /></span></div><div class=" J_Mask_{id} pic-mask"></div><div class="status-wrapper J_FileStatus"><div class="status waiting-status"><p>等待上传</p></div><div class="status start-status progress-status success-status"><div class="J_ProgressBar_{id}"></div><div>上传中</div></div><div class="status error-status"><p class="J_ErrorMsg_{id}">上传失败，请重试！</p></div></div></div><div><a class="J_Del_{id} del-pic" href="#">删除</a></div></li>'},plugins:{value:["progressBar","preview"]},defaultText:{value:f},maxText:{value:"您已上传满{max}张图片"}}});return d},{requires:["node","../../theme"]});