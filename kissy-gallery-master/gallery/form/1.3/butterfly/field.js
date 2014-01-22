/**
 *  ģ������gallery/form/1.3/butterfly/field�������ݲ�ģ�飬�����ݷ����仯ʱ���Զ����±���ͼ
 *
 * @module butterfly
 * @submodule butterfly-model
 */

KISSY.add('gallery/form/1.3/butterfly/field',function (S, Base, Node) {
    var EMPTY = '';
    /**
     * ��field������ģ��
     * @class Field
     * @constructor
     * @extends mvc.Field
     */
    function Field(config){
        Field.superclass.constructor.call(this, config);
    }
    S.extend(Field, Base,{ATTRS:{
        /**
         * Ŀ����ֶ�
         */
        target:{
            value:EMPTY,
            getter:function(v){
                return S.Node.all(v);
            }
        },
        /**
         * �ֶ�����
         */
        type:{value:EMPTY},
        /**
         * �ֶ���
         */
        name:{value:EMPTY},
        /**
         * ֵ
         */
        value:{
            value:EMPTY,
            getter:function(v){
                alert(3);
                return v;
            },
            setter:function(v){
                alert(2);
                return v;
            }
        },
        test:{value:false,
            setter:function(v){
                alert(2);
                return v;
            }
        },
        isGroup:{value:false},
        group:{value:[]}
    }});
    return Field;
},{requires:['base', 'node']});