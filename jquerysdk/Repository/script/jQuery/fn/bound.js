/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.bound
 */

jQuery.plugin( 'jQuery.fn.bound', function( $, undefined ){

	$.fn.bound = function( events, callback ) {

		var eventMap = {};

		$.each( $.trim(events).replace(/\s+/,' ').split(' '), function( i, eventName ){
			var evt = eventName.split('.');
			eventMap[ evt[0] ] = evt[1] || '';
		});

		return this.each(function( i, node ){
			// each event of current element in set
			$.each( $._data(this,'events') || [], function( type, handlers ){
				// each handlers of current event type
				$.each( handlers, function( j, handler ){
					var type = handler.origType,
						namespace = eventMap[type]!==undefined ? eventMap[type] : eventMap['*'];
					// if handler namespace
					if( namespace!==undefined && (!namespace || namespace===handler.namespace) ){
						// call
						callback.call( node, i, handler );
					}
			   });
			});
		});
	};

});