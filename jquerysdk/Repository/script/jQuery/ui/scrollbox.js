/*
 * @author          Emanuel Vitzthum
 * @copyright       © 2012 jQuery SDK v1.4
 * @info            http://www.jquerysdk.com
 *
 * @license         Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.ui.scrollbox
 */

jQuery.plugin( "jQuery.ui.scrollbox", [
	"jQuery.fn.size",
	"jQuery.support.touch",
	"jQuery.event.special.dom",
	"jQuery.event.special.mouse",
	"jQuery.event.special.touch",
	"jQuery.ui.widget"
], function( $, undefined ){

		// local scope of jQuery.style
	var _style		= $.style,

		// local scope of jQuery.css
		_css		= $.css,

		// filter css properties from css property object
		cssFilter	= function( cssObj, filter, allowEmpty ){
			var ret = {},
				val;

			$.each( filter.split(" "), function( i, prop ){
				if( (val = cssObj[ prop ] || "") || allowEmpty )
					ret[ prop ] = val;
			});

			return ret;
		},

		// restore properties filter
		filterRestore	= "overflow-x overflow-y position",

		// build drag helper elements an bind events
		helperList = {
			"paddingX"	: "padding-x",
			"paddingY"	: "padding-y",
			"layer"		: "layer",
			"dragX"		: 'drag-x ui-corner-all ui-state-default" tabIndex="0',
			"dragY"		: 'drag-y ui-corner-all ui-state-default" tabIndex="0'
		},
		helperHTML	= ['<div class="ui-scrollbox-helper ui-scrollbox-', '', '"/>'],
		helperOn	= function( self, name ){
			var on = {};
			if( name == "dragX" || name == "dragY" )
				on = {
					"mouseenter.scrollbox"	: function(){ self[name].addClass("ui-state-hover") },
					"mouseleave.scrollbox"	: function(){ self[name].removeClass("ui-state-hover") },
					"blur.scrollbox"		: function(){ self[name].removeClass("ui-state-active ui-state-focus") },
					"focus.scrollbox"		: function(event){
						self[name].addClass("ui-state-active ui-state-focus")
						self._onEnter()
					},
					"selectstart.scrollbox"	: function( event ){ event.preventDefault(); },
					"mousedrag.scrollbox"	: self.Proxy("_onMousedrag")
				};
			else if( name == helperList[3] )
				on = {
					"touchdrag.scrollbox"	: self.Proxy("_onTouchdrag")
				};

			return on;
		},

		// check whether background is dark
		isDarkExpr = /rgba?\((\d+), (\d+), (\d+)/,
		isDark = function( color ){
			var rgb = isDarkExpr.exec(color);
			return rgb ? ( ( parseInt(rgb[1])*299 + parseInt(rgb[2])*587 + parseInt(rgb[3])*114 ) / 1000 ) < 125 : false;
		},
		
		// select css class helper
		userSelectTrue		= {},
		userSelectFalse		= {},
		userSelectClear		= function(){
			if( window.getSelection )
				window.getSelection().removeAllRanges();
			else if( document.getSelection )
				document.getSelection().removeAllRanges();
			else if( document.selection && document.selection.removeAllRanges)
				 document.selection.removeAllRanges();
		};
		$.each( "-webkit-user-select -khtml-user-select -moz-user-select -ms-user-select -o-user-selectt user-select".split(" "), function( i, name ){
			userSelectFalse[ name ] = "none";
			userSelectTrue[ name ] = "";
		})

	// create scrollbox widget class
	$.widget( "ui.scrollbox", {

	//	element,				// widget DOM element
	//	restoreStyle,			// restore inline style properties
	//	restoreCSS,				// restore css style properties
	//	originalCSS,			// original style properties
	//	sizes,					// size properties cache
	//	stack,					// helper elements stack for destroy method
	//	dragX,					// vertical drag element
	//	dragY,					// horizontal drag element
	//	layer,					// overlay element to prevent selection
	//	animateTimer,			// setTimeout id of animated scrolling
	//	touchdragEventCache,	// last touchdrag event cached
	//	scrollLock,				// current locked if lockAxis scrolling enabled

		options: {
		//	x		: true,		// scroll horizontal
		//	y		: true,		// scroll vertical
			lockAxis: false		// intelligent one direction scrolling for touch devices
		},

		_create: function(){
			var self	= this,
				o		= self.options,
				elem	= self.element,
				node	= elem[0],
				rStyle	= self.restoreStyle = {},
				rCSS	= self.restoreCSS = {},
				oCSS	= self.originalCSS = {};

			$.each( filterRestore.split(" "), function( i, prop ){
				rStyle[ prop ]	= _style( node, prop );
				rCSS[ prop ]	= _css( node, prop );
				oCSS[ prop ]	= rStyle[ prop ] || rCSS[ prop ];
			});

			// set scroll options automatically
			o.horizontal = $.type(o.horizontal) != "boolean" ? !(oCSS[ "overflow-x" ] == "hidden") : o.horizontal;
			o.vertical = $.type(o.vertical) != "boolean" ? !(oCSS[ "overflow-y" ] == "hidden") : o.vertical;

			elem.addClass("ui-scrollbox")
				.attr("tabindex", elem.attr("tabindex") || 0)
				.css("position", oCSS.position == "static" ? "relative" : oCSS.position)
				.on({
					"resize.scrollbox"		: self.Proxy("_onResize"),
					"keydown.scrollbox"		: self.Proxy("_onKeydrag")
				});
				
			if( $.support.touch ){
				elem.on({
						"touchdrag.scrollbox"	: self.Proxy("_onTouchdrag")
					});
			}
			else{
				elem.on({
						"mouseenter.scrollbox focus.scrollbox"	: self.Proxy("_onEnter"),
						"mouseleave.scrollbox"	: self.Proxy("_onLeave"),
						"mousewheel.scrollbox"	: self.Proxy("_onMousewheel")
					});
			}

			self.sizes = {
					top: 0,
					left: 0,
					dWidth: 0,
					dHeight: 0
				};
		},

		_init: function(){
			var self		= this,
				dark		= isDark( self.element.css("background-color")+"" );

			self.element
				.toggleClass("ui-scrollbox-light", !dark)
				.toggleClass("ui-scrollbox-dark", dark);

			self._onResize();
		},

		_helper: function(){
			var self	= this,
				elem	= self.element,
				stack	= self.stack || (self.stack = $()),
				build,
				i = 0;
				
			$.each( helperList, function( name, data ){
				if( !self[name] || !self[name][0].parentNode ){
					build = !0;
					helperHTML[1] = data;
					self[name] = null;
					stack.splice( i, 1, (self[name] = $( helperHTML.join("") ).on( helperOn(self,name) ))[0] );
				}
				i++;
			});

			if( build ){
				stack.appendTo(elem);
			}
		},

		_onResize: function(){
			var self			= this,
				o				= self.options,
				elem			= self.element,
				sizes			= self.sizes,
				sizesTop		= sizes.top,
				sizesLeft		= sizes.left;

			self._helper();
			self._move( [], -sizesLeft, -sizesTop );
			self.paddingX.hide();
			self.paddingY.hide();

			var	elemWidth		= sizes.width			= elem.innerWidth(),
				elemHeight		= sizes.height			= elem.innerHeight(),
				contentWidth	= sizes.contentWidth	= elem.prop("scrollWidth"),
				contentHeight	= sizes.contentHeight	= elem.prop("scrollHeight"),


				dragMinWidth	= self.dragX.outerHeight(true),
				dragMinHeight	= self.dragY.outerWidth(true),
				dragWidth		= Math.max( elemWidth * elemWidth / contentWidth, dragMinWidth ),
				dragHeight		= Math.max( elemHeight * elemHeight / contentHeight, dragMinHeight ),

				hideDragX		= (sizes.dDragWidth = elemWidth - dragWidth) <= 0 || !o.horizontal ,
				hideDragY		= (sizes.dDragHeight = elemHeight - dragHeight) <= 0 || !o.vertical;

			self.dragX
				.outerWidth( (sizes.dragWidth = hideDragY ? dragWidth : dragWidth-dragMinWidth), true );
			self.dragY
				.outerHeight( (sizes.dragheight = hideDragX ? dragHeight : dragHeight-dragMinHeight), true );

			sizes.dWidth	= (sizes.contentWidth	= elem.prop("scrollWidth")) - elemWidth;
			sizes.dHeight	= (sizes.contentHeight	= elem.prop("scrollHeight")) - elemHeight;

			if( sizes.dHeight > 0 )
				self.paddingX
					.show()
					.css({
						"top":		contentHeight + "px",
						"height":	elem.css("padding-bottom")
					});

			if( sizes.dWidth > 0 && o.vertical )
				self.paddingY
					.show()
					.css({
						"left":		contentWidth + "px",
						"width":	elem.css("padding-right")
					});

			self._move( [], sizesLeft, sizesTop );

			sizes.dWidth	= (sizes.contentWidth	= elem.prop("scrollWidth")) - elemWidth;
			sizes.dHeight	= (sizes.contentHeight	= elem.prop("scrollHeight")) - elemHeight;
		},

		_onTouchdrag: function( event ){
			var self			= this,
				deltaX			= -event.dragDeltaX,
				deltaY			= -event.dragDeltaY;

			if( event.dragState == "start" && self.options.lockAxis ){
				var diff = Math.abs(deltaX) - Math.abs(deltaY);

				self.scrollLock = diff < -4 ? "y" : diff > 4 ?"x" : "";
			}

			if( self.scrollLock == "y" ){
				deltaX = event.dragDeltaX = 0;
			}
			if( self.scrollLock == "x" ){
				deltaY = event.dragDeltaY = 0;
			}

			if( event.dragState == "stop" && event.dragDeltaT < 50 ){
				var baseEvent		= self.touchdragEventCache,
					o				= self.options;

				deltaX			= o.horizontal ? -baseEvent.dragDeltaX : 0;
				deltaY			= o.vertical ? -baseEvent.dragDeltaY : 0;
				self.scrollLock = "";

				if( (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) ){
					// animate
					var increment		= (0.002 * event.dragDeltaT),
						divisor 		= 1,
						animate			= function(){
							divisor += increment;
							self._move( [1,1], deltaX = deltaX/divisor, deltaY = deltaY/divisor, null, Math.abs(deltaY) > 0.5 || Math.abs(deltaX) > 0.5 ? animate : null );

						};

					self._move( [1,1], deltaX, deltaY, event, animate );
				}
			}
			else{
				self.touchdragEventCache = event;
				self._move( [1,1], deltaX, deltaY, event );
			}
		},

		_onMousedrag: function( event ){
			var self			= this,
				elem			= $(event.target),
				sizes			= self.sizes;

			event.preventDefault();
			if( elem.is(".ui-scrollbox-drag-x") )
				self._move( [1,1], sizes.dWidth * event.dragDeltaX / sizes.dDragWidth, 0, event );
			else
				self._move( [1,1], 0, sizes.dHeight * event.dragDeltaY / sizes.dDragHeight, event );
		},

		_onKeydrag: function( event ){
			var self			= this,
				elem			= $(event.target),
				sizes			= self.sizes,
				keycode			= event.keyCode || event.which,
				deltaX			= keycode == 37 ? -25 : keycode == 39 ? 25 : 0,
				deltaY			= keycode == 38 ? -25 : keycode == 40 ? 25 : 0,
				// animation
				divisor 		= 1,
				animate			= function(){
					divisor += 0.16;
					self._move( [1,0], deltaX = deltaX/divisor, deltaY = deltaY/divisor, null, Math.abs(deltaY) > 0.5 || Math.abs(deltaX) > 0.5 ? animate : null )
				};

			if( deltaX || deltaY )
				self._move( [1,0], deltaX, deltaY, event, animate );
		},

		_onMousewheel: function( event ){
			this._move( [1,0], -event.wheelDeltaX*45, -event.wheelDeltaY*45, event );
		},

		_onEnter: function( event ){
			this._show( [1,0] );
		},

		_onLeave: function( event ){
			this._hide();
		},

		_move: function( showSettings, X, Y, event, animate ){
			var self			= this,
				o				= self.options,
				elem			= self.element,
				sizes			= self.sizes,

				curX			= elem.scrollLeft(),
				setX			= Math.min( sizes.dWidth, Math.max( curX + (o.horizontal ? X : 0), 0 ) ),

				curY			= elem.scrollTop(),
				setY			= Math.min( sizes.dHeight, Math.max( curY + (o.vertical ? Y : 0), 0 ) );

			if( setX!=curX || setY!=curY ){
				clearTimeout(self.animateTimer);
		
				// IE issue: use native javascript because it is faster than .css() 
				self.layer[0].style.left	= (sizes.left = setX) + "px";										// positioning layer X
				self.layer[0].style.top		= (sizes.top = setY) + "px";										// positioning layer Y
				self.dragX[0].style.bottom	= (-setY) + "px";													// positioning drag horizontal X
				self.dragX[0].style.left	= (setX + (setX * sizes.dDragWidth  / sizes.dWidth  || 1)) + "px";	// positioning drag horizontal Y	
				self.dragY[0].style.top		= (setY + (setY * sizes.dDragHeight / sizes.dHeight || 1)) + "px";	// positioning drag vertical X
				self.dragY[0].style.right	= (-setX) + "px";													// positioning drag vertical Y
					
				elem.scrollLeft(setX)
					.scrollTop(setY);

				self._show( showSettings );

				if( event ){
					event.preventDefault();
					event.stopImmediatePropagation();
				}

				if( animate )
					self.animateTimer = setTimeout(animate,25);
			}
		},

		_show: function( showSettings ){
			var self	= this,
				o		= self.options;

			if( !showSettings )
				showSettings = [];

			if( showSettings[1] ){
				// prevent text selection
				self.element.css(userSelectFalse);
				userSelectClear();
				// show layer
				self.layer
					.stop(true,true)
					.show()
					.fadeTo(1,1)
					.delay(100)
					.fadeTo(100,0,function(){
						// allow text selection
						self.element.css(userSelectTrue);
						userSelectClear();
						// hide layer
						self.layer.hide();
					});
			}

			if( showSettings[0] && self.sizes.dDragWidth > 0 && o.horizontal )
				// show drag X
				self.dragX
					.stop(true,true)
					.fadeTo(500,1)
					.delay(500)
					.fadeTo(500,0);
			if( showSettings[0] && self.sizes.dDragHeight > 0 && o.vertical )
				// show drag Y
				self.dragY
					.stop(true,true)
					.fadeTo(500,1)
					.delay(500)
					.fadeTo(500,0);
		},

		_hide: function(){
			this.dragX
				.stop(true,true)
				.fadeTo(500,0);
			this.dragY
				.stop(true,true)
				.fadeTo(500,0);
		},

		destroy: function(){
			var self = this;

			self.element
				.off(".scrollbox")
				.removeClass("ui-scrollbox")
				.css( $.extend( cssFilter({},filterRestore,!0), self.restoreStyle ) );

			self.stack.remove();

			self.Inherited(arguments);
		}
	});
});
