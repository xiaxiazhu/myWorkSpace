
/**
 * 工单管理
 *
 * @author wulin.zwl@taobao.com
 */
 
KISSY.add('fuwufront/workorder', function(S, undefined ){
	
 var DOT = '.', EMPTY = '';
 
 var _self;
 
    function WorkOrder(config) {
        
        WorkOrder.superclass.constructor.apply(this, arguments);

        this._init();
    };
    
    WorkOrder.ATTRS = {
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

    S.extend(WorkOrder, S.Base, {
        _init: function() {
            _self = this;
            mcrMgr=new MCR(_self.Controller,_self.Model,_self.Renderer,_self);
            
                },
        Controller:{
        init:function(self){
             
            console.log("c init");
            //var data = this.model.getData();
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
           
        }
        },
        Renderer:{init:function(self){
                
                 var me=this;
                 console.log("render init");
            }
        ,_testRender:function  () {
            // body...
            
            console.log("test render");
        }
        }
    });

    return WorkOrder;
});