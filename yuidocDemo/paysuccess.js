KISSY.add('mui/review/biz/paysuccess', function(S, DOM, Event) {

	/**
	 * This is the description for my class.
	 *
	 * @class PaySuccess
	 * @constructor
	 */
	var PaySuccess = {};


	/**
	 * 双十一评价降级开关
	 * @property On
	 * @type Boolean
	 * @default 'true'
	 */
	var On = true; // 双十一评价降级开关


	S.mix(PaySuccess, {
		/**
		* get data from ratewrite app,
		* fetch the data and save to _data field
		* 
		* @method getList
		* @param {Null} null
		* @return {Null} null
		*/
		getList: function() {

			var self = this,
				url = "http://ratewrite." + (this._config.daily ? 'daily.' : '') + "tmall."+(this._config.daily ? 'net' : 'com')+"/rate/get_all_waiting_rate_items.do?limit=3";

			// document.domain = 

			S.IO.jsonp(url, 
			// {
			// 	callback: "superstar"
			// }, 
			function(data) {

				if ( !! data) {

					self._data = data;

					self.renderList();

				};

			});

		},

		/**
		* render the review list when data is ready
		* 	
		* @method renderList
		* @param {Null} null
		* @return {Null} null
		*/
		renderList: function() {

			var self = this,
				dt = self._data.WaitingAllRate;

			if (!dt) return;

			var html = '<div class="re-container"><div class="innerborder"><h3 class="re-hd"><strong>还记得他们吗？</strong>来分享你和它们一起的故事吧~</h3><div class="itembox">';

			for (var i = 0; i < dt.length; i++) {

				var vo = dt[i];

				var rateUrl = vo.rateUrl;

				if (vo.rateStatus) {
					//rateUrl += '?bizOrderId=' + vo.mainOrderId
					if (vo.rateStatus === 4) {

						// 服务评价  superstar added
						//http://fwfront.tmall.com/protocol/get_protocol.htm?spm=a1z09.2.9.85.RZNgzT&service_item_id=25385280961&servOrderId=224083371579208&buyerId=282620892
						rateUrl += '?service_item_id=' + vo.itemId + '&servOrderId=' + vo.bizOrderId + '&buyerId=' + vo.buyerId;

					} else {

						rateUrl += '?bizOrderId=' + vo.mainOrderId;

					};

				} else {
					rateUrl += '?tradeId=' + vo.mainOrderId;
					if (vo.mainOrderId !== vo.bizOrderId) {
						rateUrl += '&subTradeId=' + vo.bizOrderId;
					}
				};

				html += '<a class="itemlink ' + (i ? '' : 'inititembox') + '" target="_blank" href="' + rateUrl + '" title="' + dt[i].goodsTitle + '">';
				html += '<div class="wait-img"><img src="' + dt[i].picUrl + '" width="60">';
				html += '</div><div class="wait-btn">去评价</div></a>';

			};

			html += '</div></div></div>';

			if (dt.length>0) {

				S.one(self._containter).append(html);

				self.eraseInitStyle();

				self.clickGoInit();

			};

		},
		/**
		* main init and call
		* 	
		* @method init
		* @param {Object} config 组件配置
		* @param {Object} config.containterid  containter append the review list to container ,avaliable for 、 id 、 node
		* @return {Null} null
		*/
		init: function(config) {

			if (!On) return; // 降级开关

			S.getScript('http://g.tbcdn.cn/mui/review-enter/1.0.0/css/entry.css');

			this._config = config;

			this.getContainer(config.containterid);

			this.getList();

		},
		/**
		* add click event for statics	
		* @method clickGoInit
		* @param {Null} null
		* @return {Null} null
		*/
		clickGoInit:function (argument) {

			var self = this,
				btnlist = S.all('.itemlink');

				btnlist.on('click',function  (ev) {

					var slist = S.Node(this).attr('href').split('?');

					var url = slist.length>1 ? slist[1]:null;

					var obj = S.unparam(url);

					var logurl  = 'http://gm.mmstat.com/tmallrate.6.3.1?logtype=2&catid='+ obj.tradeId+'&uid='+ obj.buyerId +'&itemid='+ obj.service_item_id;

					//埋点 
	       			new Image().src = logurl;

				});

		},
		/**
		* erase init style for first element
		* @method eraseInitStyle
		* @param {Null} null
		* @return {Null} null
		*/
		eraseInitStyle: function() {

			var self = this,
				btnlist = S.all('.itemlink');

			btnlist.on('mouseenter', function(ev) {

				btnlist.removeClass('inititembox');

				btnlist.removeClass('current-hover');

				S.Node(this).addClass('current-hover');

			});


			btnlist.on('mouseleave',function  (ev) {

				btnlist.removeClass('current-hover');

			});

			// S.one(self._containter+'.inititembox').length;

		},
		/**
		* get the containter node from argument
		* @method getContainer
		* @param {Object} v current node of container
		* @return {Null} null
		*/
		getContainer: function(v) {
			this._containter = v;
		},
		_data: null,
		_containter: null,
		_config: null
	});

	return PaySuccess;

}, {
	requires: ['dom', 'event']
});