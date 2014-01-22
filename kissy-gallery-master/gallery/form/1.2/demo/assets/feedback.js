/**
 * @fileoverview �û��������
 * @author: ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/feedback',function(S, DOM,Event,Base) {
    var EMPTY = '';
    /**
     * @name Feedback
     * @class �û��������
     * @version 1.0
     * @constructor
     * @augments KISSY.Base
     * @param {String | HTMLElement} container ����
     * @param {Object} config ���ö���
     * @property {HTMLElement} form ָ��������ɵı�Ԫ��
     * @description
     * ҳ�����ġ���������Ҫ���������
     * @example
     */
    function Feedback(container,config){
        var self = this;
        self.container = S.get(container);
        self.elFeedback = EMPTY;
        //�����ʼ��
        Feedback.superclass.constructor.call(self, config);
    }
    //�̳���KISSY.Base
    S.extend(Feedback, Base);
    S.mix(Feedback,/**@lends Feedback*/{
            /**
             * ֧�ֵ�ģ��
             */
            tpl : {
                DEFAULT : '<div class="feedback J_Feedback">' +
                               '<span><a href="{url}" target="_blank">{title}</a><s></s></span>' +
                           '</div>'
            }
        });
    Feedback.ATTRS = {
        tpl : {
            value : Feedback.tpl.DEFAULT
        },
        url : {
            value : ''
        },
        title : {
            value : '��������Ҫ����'
        },
        scrollDelay : {
            value : '200'
        }
    };
    S.augment(Feedback,
        /**@lends Feedback.prototype */
        {
            /**
             * ����
             */
            render : function(){
                var self = this,container = self.container;
                if(!container) return false;
                self.create();
            },
            /**
             * ��������������
             */
            create : function(){
                var self = this,container = self.container,tpl = self.get('tpl'),
                    url = self.get('url'),title = self.get('title'),
                    html,elFeedback;
                if(!S.isString(tpl) || !S.isString(url) || !S.isString(title)) return false;
                html = S.substitute(tpl,{url : url,title : title});
                elFeedback = DOM.create(html);
                DOM.append(elFeedback,container);
                self.elFeedback = elFeedback;
                self._setTopOffset();
                self._ie6Scroll();
                return elFeedback;
            },
            /**
             * ���÷��������������ƫ��
             */
            _setTopOffset : function(){
                var self = this,elFeedback = self.elFeedback,title = self.get('title'),
                    len = title.length, topOffset = len * 6;
                DOM.css(elFeedback,'marginTop','-'+topOffset+'px');
            },
            /**
             * IE6����������IE6��֧��fix��λ
             */
            _ie6Scroll : function(){
                if (S.UA.ie !== 6) return false;
                var self = this,elFeedback = self.elFeedback,curTop,top,height = DOM.height(elFeedback),
                    timer = S.later(function() {}, 0),delay = self.get('scrollDelay');
                Event.on(window, 'scroll resize', function(e) {
                    curTop = DOM.scrollTop();
                    top = (DOM.viewportHeight() - height) / 2;
                    timer.cancel();
                    timer = S.later(function() {
                        if (DOM.scrollTop() === curTop) {
                            DOM.css(elFeedback,'top', top + DOM.scrollTop());
                        }
                    }, delay);
                });
            }

        });
    return Feedback;
},{requires:['dom','event','base']});