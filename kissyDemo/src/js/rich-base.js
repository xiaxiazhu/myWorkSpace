/*

	@ author: wulin.zwl@taobao.com
	@ rich Base 继承


*/



KISSY.add("brix/core/chunk", function(S, RichBase) {

	// chuck 
	//RichBaseDerived {userConfig: Object, __attrs: Object, __attrVals: Object, __~ks_custom_events: Object, constructor: function…}

	var Chunk = RichBase.extend({
		initializer: function() {
			alert('initializer');
		},
		destructor: function() {
			alert('destructor');
		},
		_onSetName:function() {
			alert('name changed');
		},
		_onSetSize:function(){
			alert('size changed');
		}
	}, {
		ATTRS: {
        	name: {
            value:'fuck',
            valueFn:function(){
            	alert('valueFn');
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
		'Chunk'
	);


	return Chunk;
}, {
	requires: ["rich-base"]
});