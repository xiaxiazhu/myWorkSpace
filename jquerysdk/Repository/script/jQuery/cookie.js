/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @based			jQuery Cookie plugin from Klaus Hartl (stilbuero.de) license (http://www.opensource.org/licenses/mit-license.php and http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.cookie
 */

jQuery.plugin( 'jQuery.cookie', function( $, undefined ){

	$.extend({
		/*
		 * @function		$.cookie
		 * @description		read | write | delete vars in cookie
		 */
		cookie: function (key, value, options) {

			// key and value given, set cookie...
			if (arguments.length > 1 && (value === null || typeof value !== "object")) {
				options = jQuery.extend({}, options);

				if (value === null) {
					options.expires = -1;
				}

				if (typeof options.expires === 'number') {
					var days = options.expires, t = options.expires = new Date();
					t.setDate(t.getDate() + days);
				}

				return (document.cookie = [
					encodeURIComponent(key), '=',
					options.raw ? String(value) : encodeURIComponent(String(value)),
					options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path ? '; path=' + options.path : '',
					options.domain ? '; domain=' + options.domain : '',
					options.secure ? '; secure' : ''
				].join(''));
			}

			// key and possibly options given, get cookie...
			options = value || {};
			var result,
				decode = options.raw ? function (s) { return s; } : decodeURIComponent;

			return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
		}
	});

});