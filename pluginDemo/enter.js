/**
 * @fileoverview 全国联保服务供应商入驻组件入口
 * @author 武林(五零)<wulin.zwl@taobao.com>
 **/

KISSY.add("fuwu-ws/biz/enter", function(S, RichBase) {

	// chuck 
	//RichBaseDerived {userConfig: Object, __attrs: Object, __attrVals: Object, __~ks_custom_events: Object, constructor: function…}

	var Enter = RichBase.extend({
		initializer: function() {
			// alert('initializer');
		},
		destructor: function() {
			// alert('destructor');

		},
		_onSetName:function() {
			// alert('name changed');
		},
		_onSetSize:function(){
			// alert('size changed');
		},

    	/**
     	* @name Enter#init
     	* @desc  主入口
     	* @event
     	* @param {Object} ev.file 文件数据
     	*/		
		init:function () {

            S.log('main init ');

			//支付宝企业认证


			//填写联系人信息

			//确认品牌


		}
	}, {
		ATTRS: {
        	name: {
            value:'fuck',
            valueFn:function(){
            	// alert('valueFn');
            },
            setter:function(){

            },
            getter: function(s) {

            }
        	},
        	size:{
        		value:'sf'
        	}
        	// ,
        	// listeners:{
        	// 	myfire:function(e) {
        	// 		// body...
        	// 		alert('myfire trigger')
        	// 	},
        	// 	hefire:{
        	// 		fn:function  () {
        	// 			// body...
        	// 			alert(this);
        	// 		},
        	// 		context:{}
        	// 	}
        	// }
        	}
		},
		'Enter'
	);


	return Enter;
}, {
	requires: ["rich-base","sizzle"]
});