/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.each
 */

jQuery.plugin( 'jQuery.each', function( $, undefined ){

	// enable overwrite "this" with the return value
	$.extend({
		// args is for internal usage only
		each: function( object, callback, args ) {
			var overwrite;
			if( callback === true ) {
				overwrite = callback;
				callback = args;
				args = arguments[3];
			}
			var name, i = 0,
				length = object.length,
				isObj = length === undefined || $.isFunction(object),
				ret;

			if ( args ) {
				if ( isObj ) {
					for ( name in object ) {
						ret = callback.apply( object[ name ], args );
						if( ret === false ) {
							break;
						}
						else if( overwrite && ret!==undefined ) {
							object[ name ] = ret;
						}
					}
				} else {
					for ( ; i < length; ) {
						ret = callback.apply( object[ i++ ], args );
						if( ret === false ) {
							break;
						}
						else if( overwrite && ret!==undefined ) {
							object[ i ] = ret;
						}
					}
				}

			// A special, fast, case for the most common use of each
			} else {
				if ( isObj ) {
					for ( name in object ) {
						ret = callback.call( object[ name ], name, object[ name ] );
						if( ret === false ) {
							break;
						}
						else if( overwrite && ret!==undefined ) {
							object[ name ] = ret;
						}
					}
				} else {
					for ( var value = object[0],ret=true ; i < length && ret !== false; value = object[++i] ) {
						ret = callback.call( value, i, value );

						if( overwrite && ret!==undefined ) {
							object[ i ] = ret;
						}
					}
				}
			}

			return object;
		}
	});

	// enable overwrite "this" with the return value
	$.fn.extend({
		each: function( overwrite, callback, args ) {
			return $.each( this, overwrite, callback, args );
		}
	});

});