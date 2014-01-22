/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.mixin
 */

jQuery.plugin( 'jQuery.mixin', function( $, undefined ){

	var own = Object.prototype.hasOwnProperty;

	$.extend({
		/*
		 * @name			$.mixin
		 * @description		similar to $.extendbut only works on objects (!prototype)
		 */
		mixin: function() {
			// copy reference to target object
			var target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false,
				option,
				s,
				name,
				src,
				copy;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !$.isFunction(target) ) {
				target = {};
			}

			// return target if only one argument is passed
			if ( length === i ) {
				return target;
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) != null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy || !own.call( options, name ) ) {
							continue;
						}
						// Recurse if we're merging object literal values or arrays
						if ( deep && copy && ( $.isPlainObject(copy) || $.isArray(copy) ) ) {
							var clone = src && ( $.isPlainObject(src) || $.isArray(src) ) ? src
								: $.isArray(copy) ? [] : {};

							// Never move original objects, clone them
							target[ name ] = $.extend( deep, clone, copy );

						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		}
	});

});