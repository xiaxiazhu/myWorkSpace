
/**
 * 天猫服务评价
 *
 * @author wulin.zwl@taobao.com
 */
 
KISSY.add('tml/servereview/mark', function(S, undefined ){
	
 var DOT = '.', EMPTY = '';
 
 var _self;
 
    function Mark(config) {
        
        Mark.superclass.constructor.apply(this, arguments);

        this._init();
    };
    
    Mark.ATTRS = {
        /**
         * 打分容器
         * @type String|HTMLElement|KISSY.Node
         */
        container: {
            setter: function(v) {
                if (S.isString(v)) {
                    return S.one(v);
                }
                if (v.offset) return v;
                return new S.Node(v);
            }
        },
        /**
         * 默认的原因列表
         * @type Array<String>
         */
        reason: {
            value: []
        },
        /**
         * 满意程度描述列表
         * @type Array<String>
         */
        level: {
            value: []
        },
        /**
         * 提示浮层类
         * @type String
         */
        tipsCls: {
            value: 'rating-tips'
        },
        /**
         * 每个打分项类
         * @type String
         */
        itemCls: {
            value: 'shop-rating'
        },
        /**
         * 浮层样式类
         * @type String
         */
        popCls: {
            value: 'rating-pop-tip'
        },
        /**
         * 当前项类
         * @type String
         */
        currentCls: {
            value: 'current-rating'
        },
        /**
         * 结果类
         * @type String
         */
        resultCls: {
            value: 'result'
        },
        /**
         * 取值属性
         * @type String
         */
        valueName: {
            value: 'data-star-value'
        },
        modelData:{
            setter: function(v) {
                return v+"setter";
            }
        }
    };
        /*
         * MCR 三元组
         */
        function MCR(Controller,Model,Renderer,self)
        {
            
            //初始化  mcr
            this.controller=Controller;
            this.model=Model;
            this.renderer=Renderer;
            
            
            // 建立控制关系
            this.controller.model=this.model;
            this.controller.renderer=this.renderer;
            this.model.controller=this.controller;
            this.renderer.controller=this.controller;
            
            if(typeof this.model.init=="function")
            {
                this.model.init(self);
            }
            if(typeof this.renderer.init=="function")
            {
                this.renderer.init(self);
            }
            if(typeof this.controller.init=="function")
            {
                this.controller.init(self);
            }
        } 

    S.extend(Mark, S.Base, {
        _init: function() {
            _self = this;
            var self = this;
            
            mcrMgr=new MCR(self.Controller,self.Model,self.Renderer,self);
            
                },
        Controller:{
        init:function(self){
             
            console.log("c init");
            var data = this.model.getData();
        },
        _testModel:function(self){
            console.log("test control func");
        }
        },
        Model:{init:function(self){
            
                this.data = [
                {id:0,name:"Johsssn",age:22},
                {id:1,name:"Tom",age:30},
                {id:2,name:"Tony",age:25}
               ];
               console.log("m init");
           
        },
        _testModel:function(){
            console.log("test model func");
        },
        getData:function () {
            
            return  _self.get("modelData");
        }
        },
        Renderer:{init:function(self){
                
                 var me=this;
                 console.log("render init");
                 
                 // $("#btnSubmitModify").click(function()
                 // {
                 //     var user={id:$("#spID").text(),name:$("#txtName").val(),age:$("#txtAge").val()};
                 //     me.controller.submitModify(user);
                 // });
                 // $("#btnCancelModify").click(function()
                 // {
                 //     me.controller.cancelModify();
                 // });
                 // $("#tbUsers .modify").click(function()
                 // {
                 //     var id=$(this).attr("uid");
                 //     me.controller.beginModify({"id":id});
                 // });

            this.starRender();

            }
        ,_testRender:function  () {
            // body...
            
            console.log("test render");
            
        },
        starRender:function (argument) {
            // body...
            var self = _self;
            
            var container = self.get('container');
            if (!container) return;

            var reason = self.get('reason'), level = self.get('level'),
                currentCls = self.get('currentCls');
            container.all(DOT+self.get('itemCls')).each(function(item, i) {
                if (!reason[i]) reason[i] = [];

                item.all('a').each(function(a, j) {
                    
                    reason[i][j] = reason[i][j] || EMPTY;
                    level[j] = level[j] || EMPTY;

                    var sc = a.attr(self.get('valueName')),
                        rs = reason[i][j];

                    a.on('click', function(ev) {
                        ev.halt();

                        item.all(DOT+currentCls).removeClass(currentCls);
                        a.addClass(currentCls);

                        container.all(DOT+self.get('tipsCls')).hide();
                        item.one('input').val(sc);
                        item.one(DOT+self.get('resultCls')).html('<span><em>' + sc + '</em> 分</span> - <strong>' + rs + '</strong>');

                        self.fire('rating', {idx: i, score: sc});

                    }).on('mouseenter', function(e) {
                        var obj = new S.Node(e.currentTarget),
                            offset = obj.offset(),
                            coffset = container.offset();

                        container.all(DOT+self.get('popCls'))
                            .html('<span><em>' + sc + '</em> 分 ' + level[j] + '</span><strong>' + rs + '</strong>')
                            .css({
                                'left': offset.left + obj.width() - coffset.left - 100+ 'px',
                                'top': offset.top - coffset.top + obj.height() + 'px'
                            }).show();
                    }).on('mouseleave', function() {
                        container.all(DOT+self.get('popCls')).hide();
                    });

                    // ie6 change a class to his parent
                    try {
                        if (S.UA.ie === 6) {
                            a.parent().addClass(a.attr('class').split()[0]);
                        }
                    } catch(e) {}
                });
            });
        }
        }
    });

    return Mark;
});