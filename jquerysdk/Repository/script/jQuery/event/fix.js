/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.event.fix
 */

jQuery.plugin( 'jQuery.event.fix', function( $, undefined ){

	var _fix = $.event.fix;

	$.extend( $.event, {
		fix: function( event ) {
			var originalEvent;
			
			// run  the original fix method
			event = _fix.call( $.event, event );

			// get the original event
			if( !(originalEvent = event.originalEvent) )
				return event;

			// Add originalTarget, if necessary
			if ( !event.originalTarget )
				event.originalTarget = originalEvent.srcElement || event.target;

			// be sure touches isn't undefined
			// Calculate pageX/Y if missing and touches[0] available
			if( (event.touches = originalEvent.touches || {length:0}).length ){
				event.pageX = event.touches[0].pageX;
				event.pageY = event.touches[0].pageY;
			}
			// Calculate pageX/Y and touches[0] if missing and touch available
			else if( originalEvent.touch ){
				event.touches = { 0: originalEvent.touch, length: 1 };
				event.pageX = originalEvent.touch.pageX;
				event.pageY = originalEvent.touch.pageY;
			}

			return event;
		}
	});

});