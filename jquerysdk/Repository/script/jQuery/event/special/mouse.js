/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.event.special.mouse
 */

jQuery.plugin( 'jQuery.event.special.mouse', function( $, undefined ){

	var html = $('html'),

		dragNamespace	= '_specialMousedrag',

		wheelNamespace	= '_specialMousewheel',

		getId = function( node, obj ){
			return ( node[ $.expando ] || (node[ $.expando ] = ++$.guid) )+'.'+( obj.guid || (obj.guid = ++$.guid) );
		},

		mousedown = function( originalBind, originalHandler, originalTarget, namespace, id ){
			return (mousedown[ id ] = function( event ){
					var cache;
			
					html.on( 'mousemove.'+namespace, mousemove( originalBind, originalHandler, originalTarget, namespace, id ) )
						.on( 'mouseup.'+namespace, mouseup( originalBind, originalHandler, originalTarget, namespace, id ) );
						
					cache = mousemove[ id ];

					cache.state = "start";
					cache.startT = cache.deltaT;
					cache.startX = (cache.pageX = event.pageX) + 0;
					cache.startY = (cache.pageY = event.pageY) + 0;
				});
		},

		mousemove = function( originalBind, originalHandler, originalTarget, namespace, id ){
			return (mousemove[ id ] = function( event ){
					var cache = mousemove[ id ];
					
					event.type = originalBind.type;
					event.target = originalTarget;
					event.data = originalBind.data;

					event.dragState = cache.state;
					event.dragDeltaT = - cache.deltaT + (cache.deltaT = event.timeStamp);
					event.dragDeltaX = event.pageX - cache.pageX;
					event.dragDeltaY = event.pageY - cache.pageY;
					event.dragDelta  = delta  = Math.sqrt( Math.pow(event.dragDeltaX,2) + Math.pow(event.dragDeltaY,2) );

					cache.pageX = event.pageX;
					cache.pageY = event.pageY;
					cache.state = "while";

					return originalHandler.apply(originalTarget,arguments);
				});
		},

		mouseup = function( originalBind, originalHandler, originalTarget, namespace, id ){
			return (mouseup[ id ] = function(event){if( mousemove[ id ] ){
					var cache = mousemove[ id ];

					html.off( 'mousemove.'+namespace, cache )
						.off( 'mouseup.'+namespace, mouseup[ id ] );
						
					event.dragState = "stop";
					event.dragDeltaT = - cache.deltaT + event.timeStamp;
					event.dragDeltaX = 0;
					event.dragDeltaY = 0;
					event.dragDelta  = 0;
					
					originalHandler.apply(originalTarget,arguments);

					delete mousemove[ id ];
					delete mouseup[ id ];
				}});
		},

		mousewheel = function( originalBind, originalHandler, originalTarget, namespace, id ){
			return (mousewheel[ id ] = function( event, delta, x, y ){
					var originalEvent = event.originalEvent;

					event.wheelDelta  = originalEvent.wheelDelta  ? originalEvent.wheelDelta  / 120 : originalEvent.detail ? originalEvent.detail/-3 : 0;
					event.wheelDeltaX = originalEvent.wheelDeltaX ? originalEvent.wheelDeltaX / 120 : 0;
					event.wheelDeltaY = originalEvent.wheelDeltaY!==undefined ? originalEvent.wheelDeltaY / 120 : event.wheelDelta;

					// Gecko
				    if ( originalEvent.axis !== undefined && originalEvent.axis === originalEvent.HORIZONTAL_AXIS ) {
				        event.wheelDeltaY = 0;
				        event.wheelDeltaX = event.wheelDelta;
				    }

					event.type = originalBind.type;

					return originalHandler.apply(this,arguments);
				});
		};

	$.extend( $.event.special, {
		mousedrag: {
			// don't add real event
			setup: $.noop,
			// add special handler
			add: function( bind ) {
				$(this).on( 'mousedown.'+dragNamespace, mousedown( bind, bind.handler, this, dragNamespace, getId(this,bind) ) );
			},
			// remove special handler
			remove: function( unbind ) {
				var id = getId(this,unbind),
					handlerDown = mousedown[ id ],
					handlerMove = mousemove[ id ];

				$(this).off( 'mousedown.'+dragNamespace, handlerDown );
				delete( handlerDown );

				html.off( 'mousemove.'+dragNamespace, handlerMove );
				delete handlerMove;
			}
		},
		mousewheel: {
			// add special handler
			add: function( bind ) {
				var handler = mousewheel( bind, bind.handler, this, wheelNamespace, getId(this,bind) );

				// Gecko
				$(this).on( 'DOMMouseScroll.'+wheelNamespace, handler );

				bind.handler = handler;
			},
			// remove special handler
			remove: function( unbind ) {
				var handler = mousewheel[ getId(this,unbind) ];

				// Gecko
				$(this).off( 'DOMMouseScroll.'+wheelNamespace, handler );

				delete handler;
			}
		}
	});

});