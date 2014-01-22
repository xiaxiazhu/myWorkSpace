
        var UserManagerMCR;
        
        $(function()
        {
            UserManagerMCR=new MCR(UserController,UserModel,UserRenderer);
        }); 

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
        function UserController()
        {
           this.init=function()
            {
                this.initUserList();
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

        } 

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

        } 

        /*
         * 渲染器
         */
        function UserRenderer()
        {
            this.init=function()
            {
                 var me=this;
                 $("#btnSubmitModify").click(function()
                 {
                     var user={id:$("#spID").text(),name:$("#txtName").val(),age:$("#txtAge").val()};
                     me.controller.submitModify(user);
                 });
                 $("#btnCancelModify").click(function()
                 {
                     me.controller.cancelModify();
                 });
                 $("#tbUsers .modify").click(function()
                 {
                     var id=$(this).attr("uid");
                     me.controller.beginModify({"id":id});
                 });
            } 

            this.renderUserList=function(list)
            {
                var htm=[];
                for(var ix=0;ix<list.length;ix++)
                {
                    htm.push("<tr><td>" +list[ix]["id"]+"</td>" +"<td>"+list[ix]["name"]+"<td>"+list[ix]["age"]+"</td>"
                        +"<td>"+"<a class='modify' href='javascript:void(0)' uid='"+list[ix]["id"]+"'>修改</a></td>"+"</tr>");
                }
                $("#tbUsers").children("tbody").html(htm.join(""));
            } 

            this.showModifyUI=function(user)
            {
                $("#dvEditPanel").show();
                $("#spID").text(user["id"]);
                $("#txtName").val(user["name"]);
                $("#txtAge").val(user["age"]);
            } 

            this.hideModifyUI=function()
            {
                document.frmModify.reset();
                $("#dvEditPanel").hide();
            } 

            this.renderUIWhenSubmitModifySuccess=function(list)
            {
                this.hideModifyUI();
                this.renderUserList(list);
            }
        }