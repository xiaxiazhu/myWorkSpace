/**
 * @fileoverview 下一步流程跑通测试用例
 * 
 * @author 武林(五零)<wulin.zwl@taobao.com>
 **/

KISSY.add('fuwu-ws/testcase/plugins/tab',function(S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name TagConfig
     * @class 进度条集合
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function T_Tab(config) {
        var self = this;
        //调用父类构造函数
        T_Tab.superclass.constructor.call(self, config);
    }
    S.extend(T_Tab, Base, /** @lends T_Tab.prototype*/{
        /**
         * 插件初始化
          * @private
         */
        pluginInitializer : function(enter) {

            if(!enter) return false;

            var self = this;

            S.log('plugin loaded');


            // uploader.on('success',self._successHandler,self);


        },
        /**
         * 上传成功了添加图片放大器
         * @param ev
         * @private
         */
        _successHandler:function(ev){
            // var self = this;
            // var file = ev.file;
            // var id = file.id;
            // //服务器端返回的数据
            // var result = file.result;
            // var sUrl =  result.url;
            // var $img = $('.J_Pic_'+id);
            // $img.attr('data-original-url',sUrl);
            // $img.addClass('J_ImgDD');
            // self._renderIMGDD(file.target);
        }
    }, {ATTRS : /** @lends T_Tab*/{
        /**
         * 插件名称
         * @type String
         * @default urlsInput
         */
        pluginId:{
            value:'T_Tab'
        }
    }});
    return T_Tab;
}, {requires : ['node','base']});
