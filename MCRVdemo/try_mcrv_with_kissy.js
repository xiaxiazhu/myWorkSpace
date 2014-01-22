// module mark star


/**
 * 天猫服务评价
 *
 * @author wulin.zwl@taobao.com
 */
 
KISSY.add('tml/servereview/mark', function(S, undefined ){
	
 var DOT = '.', EMPTY = '';
 
 var mcrMgr;
 
        /*
         * MCR 三元组
         */
        function MCR(Controller,Model,Renderer)
        {
            
            //初始化  mcr
            this.controller=new Controller();
            this.model=new Model();
            this.renderer=new Renderer();
            
            
            // 建立控制关系
            this.controller.model=this.model;
            this.controller.renderer=this.renderer;
            this.model.controller=this.controller;
            this.renderer.controller=this.controller;
            
            if(typeof this.model.init=="function")
            {
                this.model.init();
            }
            if(typeof this.renderer.init=="function")
            {
                this.renderer.init();
            }
            if(typeof this.controller.init=="function")
            {
                this.controller.init();
            }
        } 

         /*
         * 控制器
         */
        function UserController(){
        
        
            this.init=function()
            {
                this.initUserList();
               KISSY.log( "controller initail ");
                
            } 

            this.initUserList=function()
            {
                var list=this.model.getUserList();
                this.renderer.renderUserList(list);
            } 

            this.beginModify=function(data)
            {
                var user=this.model.getUserByID(data.id);
                this.renderer.showModifyUI(user);
            } 

            //提交修改
            this.submitModify=function(user)
            {
                var result=this.model.modifyUser(user);
                if(result.success)
                {
                    var list=this.model.getUserList();
                    this.renderer.renderUIWhenSubmitModifySuccess(list);
                }
                else
                {
                    alert(result.msg);
                }
            } 

            //取消修改
            this.cancelModify=function()
            {
                this.renderer.hideModifyUI();
            } 
        } ;

        /*
         * 模型
         */
        function UserModel()
        {
            //模拟的数据，实际应用中经常从服务器获取 

           this.init=function()
           {
              this.data = [
                {id:0,name:"Johsssn",age:22},
                {id:1,name:"Tom",age:30},
                {id:2,name:"Tony",age:25}
               ];
               S.log( "model initail ");
               
           } 

            //获得用户数据列表
            this.getUserList=function()
            {
                //todo ,可能ajax从后端返回
                return this.data;
            } 

            //获得用户数据
            this.getUserByID=function(id)
            {
                var ix;
                $.each(this.data,function(i,item){if(item["id"]==id ) { ix=i; return false;}});
                return this.data[ix];
            } 

            //修改用户数据
            this.modifyUser=function(user)
            {
                var result={success:true,msg:"修改成功"};
                //todo,验证参数user
                //todo,修改用户数据
                $.each(this.data,function(i,item)
                {
                    if(item["id"]==user["id"])
                    {
                        item["name"]=user["name"];
                        item["age"]=user["age"]
                        return false;
                    }
                });
                return result;
            } 

        } ;

        /*
         * 渲染器
         */
       function UserRenderer()
        {
            this.init=function()
            {
                 var me=this;
                 
                 
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
            } 

            this.renderUserList=function(list)
            {
                var htm=[];
                for(var ix=0;ix<list.length;ix++)
                {
                    htm.push("<tr><td>" +list[ix]["id"]+"</td>" +"<td>"+list[ix]["name"]+"<td>"+list[ix]["age"]+"</td>"
                        +"<td>"+"<a class='modify' href='javascript:void(0)' uid='"+list[ix]["id"]+"'>修改</a></td>"+"</tr>");
                }
               // $("#tbUsers").children("tbody").html(htm.join(""));
               S.log({}, "render initail ");
            } 

            this.showModifyUI=function(user)
            {
                           } 

            this.hideModifyUI=function()
            {
           
            } 

            this.renderUIWhenSubmitModifySuccess=function(list)
            {
                          
            }
        };


// 华丽的分割线，，，，，

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
        }
    };

    S.extend(Mark, S.Base, {
        _init: function() {
            var self = this;
            
            mcrMgr = new MCR(self.Controller,self.Model,self.Renderer);
            //mcrMgr = new MCR(UserController,UserModel,UserRenderer);


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
        },
        MCR:function(Controller,Model,Renderer)
        {
            
            //初始化  mcr
            this.controller=new Controller();
            this.model=new Model();
            this.renderer=new Renderer();
            
            
            // 建立控制关系
            this.controller.model=this.model;
            this.controller.renderer=this.renderer;
            this.model.controller=this.controller;
            this.renderer.controller=this.controller;
            
            if(typeof this.model.init=="function")
            {
                this.model.init();
            }
            if(typeof this.renderer.init=="function")
            {
                this.renderer.init();
            }
            if(typeof this.controller.init=="function")
            {
                this.controller.init();
            }
        } ,
        Controller:function(){
             this.init=function()
            {
                this.initUserList();
               KISSY.log( "controller initail ");
                
            } 
        },
        Model:function(){
            
           this.init=function()
           {
              this.data = [
                {id:0,name:"Johsssn",age:22},
                {id:1,name:"Tom",age:30},
                {id:2,name:"Tony",age:25}
               ];
               S.log( "model initail ");
           } 
        },
        Renderer:function(){
            this.init=function()
            {
                 var me=this;
                 
                 
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
            } 

        }
        
    });

    return Mark;
});