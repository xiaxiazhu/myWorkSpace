/**
 * @fileoverview  ���IE6��ģ����Զ�λ���޷��ڸ�input��bug
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/form/1.3/select/iframeShade',function(S,Node,Base){
        var EMPTY = '',$ = Node.all;
        /**
         * @name IframeShade
         * @class ���IE6��ģ����Զ�λ���޷��ڸ�input��bug
         * @constructor
         * @extends Base
         * @requires Node
         */
        function IframeShade(target,config){
            var self = this,
                cfg = S.merge({target : $(target)},config);
            //���ø��๹�캯��
            IframeShade.superclass.constructor.call(self, cfg);
            self._init();
        }
        S.extend(IframeShade,Base,/** @lends IframeShade.prototype*/{
                /**
                 * ����
                 */
                _init : function(){
                    var self = this,$target = self.get('target');
                }
        },{ATTRS : /** @lends IframeShade*/{
            target:{value:EMPTY},
            tpl:{value:'<iframe src="" width="{width}" height="{height}" class="ks-nice-select-iframe"></iframe>'}
        }});
        return IframeShade;
},{requires : ['node','base']});