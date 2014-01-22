/**
 * 天猫评价展现
 *
 * @author wulin.zwl@taobao.com
 *
 * @date: 2013年07月05日10:11:38
 */

KISSY.add('review/mallphotos', function(S, Data) {
    
     var DOT = '.',
        EMPTY = '',
        log = S.log,
        $ = S.all,
        self;

    var userConfig={};

    function MallPhotos(config) {

        MallPhotos.superclass.constructor.apply(this, arguments);
        S.mix(userConfig,config);
        this.init();
    };

    MallPhotos.ATTRS = {
        container: {
            setter: function(v) {
                if (S.isString(v)) {
                    return S.one(v);
                }
                if (v.offset) return v;
                return new S.Node(v);
            }
        },
        hasTitle: {
            value: true
        },
        successHandleInner:{
            value:false
        },
        subTitle:{
            value:''
        }
    };

    S.extend(MallPhotos, S.Base, {
          init: function() {

            self = this;


        }
    });
    
    
    return MallPhotos;
    
},{requires:[]});