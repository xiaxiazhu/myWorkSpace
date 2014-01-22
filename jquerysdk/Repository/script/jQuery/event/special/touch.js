/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.event.special.touch
 */

jQuery.plugin( "jQuery.event.special.touch", "jQuery.event.fix", function( $, undefined ){

	var html = $("html"),

		namespaceDrag = "_specialTouchdrag",

		namespacePinch = "_specialTouchpinch",

		namespacePinchX = "_specialTouchpinchInOut",

		namespaceSwipe = "_specialTouchswipe",

		handlerPinchX = function(){},

		handlerSwipe = function(){},

		// get the pinch direction by delta pinch value
		getPinch = function( delta, oldDelta, min ){
			return 	min && Math.abs(delta) < min ? false : !delta ? oldDelta : (delta >= 0 ? 'in' : 'out');
		},


		// get the swipe direction by delta drag values
		getSwipe = function( deltaX, deltaY, min ){
			var absX = Math.abs(deltaX),
				absY = Math.abs(deltaY);

			return (Math.abs(absX - absY) <= 1) || !(!min || absX > min || absY > min) ? false : (absX > absY ? (deltaX < 0 ? "left" : "right") : (deltaY < 0 ? "up" : "down"));
		},


		// get/set the id for element + handler
		getId = function( node, obj ){
			return ( node[ $.expando ] || (node[ $.expando ] = ++$.guid) )+"."+( obj.guid || (obj.guid = ++$.guid) );
		},

		// check target (may it's a text element)
		isTarget = function( target, originalTarget ){
			var fixedTarget = target.nodeType === 3 ? target.parentNode : target;

			return fixedTarget===originalTarget || $.contains(originalTarget, fixedTarget);
		},

		touchstart = function( originalBind, originalHandler, originalTarget, namespace, id ){
			return (touchstart[ id ] = function(event){
					var touches = event.touches,
						isDrag	= originalBind.type==="touchdrag" && touches.length === 1 &&
									isTarget(event.originalTarget, originalTarget),
						isPinch	= originalBind.type==="touchpinch" &&  touches.length === 2 &&
									isTarget(touches[0].target, originalTarget) &&
									isTarget(touches[1].target, originalTarget),
						cache;

					// setup params
					if( isDrag || isPinch ){
						// bind move / end events
						html.on( "touchmove."+namespace, touchmove( originalBind, originalHandler, originalTarget, namespace, id ) )
							.on( "touchend."+namespace, touchend( originalBind, originalHandler, originalTarget, namespace, id ) )
							.on( "touchcancel."+namespace, touchcancel( originalBind, originalHandler, originalTarget, namespace, id ) );

						cache = touchmove[ id ];
						cache.direction = true;
						cache.state = "start";
						cache.deltaT = event.timeStamp;
					}
					// TOUCHDRAG setup params
					if( isDrag ){
						cache.startT = cache.deltaT;
						cache.startX = (cache.deltaX = event.pageX) + 0;
						cache.startY = (cache.deltaY = event.pageY) + 0;
					}
					// TOUCHZOOM setup params
					if( isPinch ){
						cache.delta  = Math.sqrt(
							Math.pow( cache.startX = (cache.deltaX = Math.abs( touches[0].pageX - touches[1].pageX )) + 0, 2 ) +
							Math.pow( cache.startY = (cache.deltaY = Math.abs( touches[0].pageY - touches[1].pageY )) + 0, 2 )
						);
						cache.start	= cache.delta + 0;
					}
				});
		},

		touchmove = function( originalBind, originalHandler, originalTarget, namespace, id ){
			return (touchmove[ id ] = function(event){
					var touches = event.touches,
						isDrag	= originalBind.type==="touchdrag",
						isPinch = originalBind.type==="touchpinch" && touches.length >= 2,
						cache	= touchmove[ id ],
						state,
						deltaT,
						deltaX,
						deltaY,
						delta,
						direction,
						_direction;

					// TOUCHDRAG modify event params
					if( isDrag ){
						state		= event.dragState  = cache.state;
						deltaT		= event.dragDeltaT = - cache.deltaT + (cache.deltaT = event.timeStamp);
						deltaX		= event.dragDeltaX = - cache.deltaX + (cache.deltaX = event.pageX);
						deltaY		= event.dragDeltaY = - cache.deltaY + (cache.deltaY = event.pageY);
						delta		= event.dragDelta  = Math.sqrt( Math.pow(deltaX,2) + Math.pow(deltaY,2) );
						_direction	= cache.direction;
						direction	= getSwipe( deltaX, deltaY );
					}
					// TOUCHZOOM modify event params
					if( isPinch ){
						event.pinchState	= cache.state;
						event.pinchDeltaT	= - cache.deltaT + (cache.deltaT = event.timeStamp);
						event.pinchDeltaX	= - cache.deltaX + (cache.deltaX = deltaX = Math.abs( touches[0].pageX - touches[1].pageX ) );
						event.pinchDeltaY	= - cache.deltaY + (cache.deltaY = deltaY = Math.abs( touches[0].pageY - touches[1].pageY ) );
						event.pinchDelta	= - cache.delta  + (cache.delta  = delta  = Math.sqrt( Math.pow(deltaX,2) + Math.pow(deltaY,2) ) );
						direction			= getPinch( event.pinchDelta, _direction = cache.direction );
					}

					// trigger
					if( isDrag || isPinch ){
						event.type = originalBind.type;
						event.target = originalTarget;
						event.data = originalBind.data;
						cache.state = "while";
						cache.direction = direction && _direction ? _direction !== true ? (direction == _direction ? direction : false) : direction : _direction;

						// $.event.trigger( event, originalBind.data, originalTarget, true );
						// doesn't work because it prevents default
						originalHandler.apply(originalTarget,arguments);
					}
				});
		},

		touchend = function( originalBind, originalHandler, originalTarget, namespace, id ){
			return (touchend[ id ] = function(event){if( touchmove[ id ] ){
					// unbind events
					html.off( "touchmove."+namespace, touchmove[ id ] )
						.off( "touchend."+namespace, touchend[ id ] )
						.off( "touchcancel."+namespace, touchend[ id ] );

					var isEnd	= /^touch(end|cancel)$/.test(event.type),
						isDrag	= originalBind.type==="touchdrag" && isEnd,
						isPinch = originalBind.type==="touchpinch" && isEnd,
						cache	= touchmove[ id ],
						state,
						deltaT,
						deltaX,
						deltaY,
						delta,
						direction,
						_direction;

					// TOUCHDRAG modify event params
					if( isDrag ){
						event.dragState = cache.state = "stop";
						event.dragDeltaT = - cache.deltaT + event.timeStamp;
						event.dragDeltaX = 0;
						event.dragDeltaY = 0;
						event.dragDelta  = 0;
					}
					// TOUCHZOOM modify event params
					if( isPinch ){
						event.pinchState = cache.state = "stop";
						event.pinchDeltaT = - cache.deltaT + event.timeStamp;
						event.pinchDeltaX = 0;
						event.pinchDeltaY = 0;
						event.pinchDelta  = 0;
					}
					// trigger
					if( isDrag || isPinch ){
						event.type = originalBind.type;
						event.target = originalTarget;
						event.data = originalBind.data;

						//$.event.trigger( event, originalBind.data, originalTarget, true );
						// doesn't work because it prevents default
						originalHandler.apply(originalTarget,arguments);
					}
					// TOUCHSWIPE modify event params
					if( isDrag && namespace == namespaceSwipe ){
						delete( event.dragState );

						deltaT = event.dragDeltaT = - cache.startT + event.timeStamp;
						deltaX = event.dragDeltaX = - cache.startX + cache.deltaX;
						deltaY = event.dragDeltaY = - cache.startY + cache.deltaY;
						_direction	= cache.direction;
						direction = getSwipe( deltaX, deltaY, 20 );

						if( direction && _direction == direction ){
							event.type = "touchswipe" + direction;
							$(originalTarget).trigger(event);
						}
					}
					// TOUCHPINCH IN / OUT modify event params
					if( isPinch && namespace == namespacePinchX ){
						delete( event.pinchState );

						deltaT = event.pinchDeltaT	= - cache.startT + event.timeStamp;
						deltaX = event.pinchDeltaX	= - cache.startX + cache.deltaX;
						deltaY = event.pinchDeltaY	= - cache.startY + cache.deltaY;
						delta  = event.pinchDelta	= - cache.start  + cache.delta;
						direction = getPinch( delta, _direction	= cache.direction, 80 );

						if( direction && _direction == direction ){
							event.type = "touchpinch" + direction;
							$(originalTarget).trigger(event);
						}
					}

					delete( touchmove[ id ] );
					delete( touchend[ id ] );
				}});
		},

		touchcancel = touchend;

	// touchdrag, touchpinch
	$.each({
		touchdrag: namespaceDrag,
		touchpinch: namespacePinch
	}, function( name, namespace ) {

		$.event.special[ name ] = {
			// don't add real event
			setup	: $.noop,
			// add special handler
			add		: function( bind ) {
				namespace = bind.namespace === namespaceSwipe ? namespaceSwipe : bind.namespace === namespacePinchX ? namespacePinchX : namespace;
				$(this).on( "touchstart."+namespace, touchstart( bind, bind.handler, this, namespace, getId(this,bind) ) );
			},
			// remove special handler
			remove	: function( unbind ) {
				var id = getId(this,unbind),
					handleStart = touchstart[ id ],
					handleMove = touchmove[ id ];

				namespace = unbind.namespace === namespaceSwipe ? namespaceSwipe : unbind.namespace === namespacePinchX ? namespacePinchX : namespace;

				$(this).off( "touchstart."+namespace, handleStart );
				delete( handleStart );

				html.off( "touchmove."+namespace, handleMove );
				delete( handleMove );
			}
		};

	});

	// touchpinchin, touchpinchout
	$.each({
		'in'	: namespacePinchX,
		out		: namespacePinchX
	}, function( name, namespace ){

		$.event.special[ "touchpinch"+name ] = {
			// don't add real event
			setup	: $.noop,
			// add special handler
			add		: function( bind ) {
				if( !touchstart[ getId(this,handlerPinchX) ] )
					$(this).on("touchpinch."+namespace,handlerPinchX);
			}
		};

	});

	// touchswipeup, touchswiperight,touchswipedown,touchswipeleft
	$.each({
		up		: namespaceSwipe,
		right	: namespaceSwipe,
		down	: namespaceSwipe,
		left	: namespaceSwipe
	}, function( name, namespace ){

		$.event.special[ "touchswipe"+name ] = {
			// don't add real event
			setup	: $.noop,
			// add special handler
			add		: function( bind ) {
				if( !touchstart[ getId(this,handlerSwipe) ] )
					$(this).on("touchdrag."+namespace,handlerSwipe);
			}
		};

	});

	// DEPRECATED: touchzoom
	var zoom = {},
		zoomMap = "State DeltaT DeltaX DeltaY Delta".split(" ");
	$.event.special.touchzoom = {
		// don't add real event
		setup	: $.noop,
		// add special handler
		add		: function( bind ) {
			$.debug.warn("METHOD DEPRECATED: 'touchzoom' event is replaced by 'touchpinch' event");

			$(this)
				.on("touchpinch."+namespacePinch, (
					zoom[ getId(this,bind) ] = function(event){
						for( var i=0,l=zoomMap.length ; i<l ; i++ ){
							event[ 'zoom'+zoomMap[ i ] ] = event[ 'pinch'+zoomMap[ i ] ];
							delete event[ 'pinch'+zoomMap[ i ] ];
						}
						event.type = 'touchzoom';
						bind.handler.apply(this,arguments);
					})
				);
		},
		// remove special handler
		remove	: function( unbind ) {
			var id = getId(this,unbind);

			$(this).off("touchpinch."+namespacePinc, zoom[ id ] );
			delete zoom[ id ];
		}
	};


});