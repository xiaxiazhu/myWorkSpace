/**
 * ���ٹ���������
 * @module butterfly
 */

/**
 *  ģ������gallery/form/1.3/butterfly/model�������ݲ�ģ�飬�����ݷ����仯ʱ���Զ����±���ͼ
 *
 * @module butterfly
 * @submodule butterfly-model
 */

KISSY.add('gallery/form/1.3/butterfly/model',function (S, Base, Node,mvc) {
    var EMPTY = '';
    /**
     * ��field������ģ��
     * @class Model
     * @constructor
     * @extends mvc.Model
     */
    function Model(){
        Model.superclass.constructor.apply(this, arguments);
    }
    S.extend(Model, mvc.Model,{ATTRS:{
        target:{
            value:EMPTY,
            getter:function(v){
                return S.Node.all(v);
            }
        },
        type:{value:EMPTY},
        name:{value:EMPTY},
        value:{
            value:EMPTY,
            setter:function(v){
                debugger;
                var self = this;
                var target = self.get('target');
                if(target && target.length > 0){
                    target.val(v);
                }
                return v;
            }
        },
        isGroup:{value:false},
        group:{value:[]}
    }});
    return Model;
},{requires:['base', 'node','mvc']});