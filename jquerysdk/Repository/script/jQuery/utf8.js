/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.utf8
 */

jQuery.plugin( 'jQuery.utf8', function( $, undefined ){

	$.extend({

		toUTF8: function( input ){
			input = input.replace(/\r\n/g,"\n");
			var output = "";

			for( var n = 0 ; n < input.length ; n++ ){
				var c = input.charCodeAt(n);
				if (c < 128) {
					output += String.fromCharCode(c);
				}
				else if( (c > 127) && (c < 2048) ){
					output += String.fromCharCode((c >> 6) | 192);
					output += String.fromCharCode((c & 63) | 128);
				}
				else{
					output += String.fromCharCode((c >> 12) | 224);
					output += String.fromCharCode(((c >> 6) & 63) | 128);
					output += String.fromCharCode((c & 63) | 128);
				}
			}

			return output;
		},

		fromUTF8: function( input ){
			var output = "",
				i = 0,
				c = 0,
				c1 = 0,
				c2 = 0;

			while( i < input.length ){
				c = input.charCodeAt(i);
				if (c < 128) {
					output += String.fromCharCode(c);
					i++;
				}
				else if((c > 191) && (c < 224)) {
					c2 = input.charCodeAt(i+1);
					output += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = input.charCodeAt(i+1);
					c3 = input.charCodeAt(i+2);
					output += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}

			return output;
		},

		encodeUTF8: function( input ){
			$.debug.warn("METHOD DEPRECATED: jQuery.encodeUTF8 is replaced by 'jQuery.toUTF8'");
			return $.toUTF8( input );
		},

		decodeUTF8: function( input ) {
			$.debug.warn("METHOD DEPRECATED: jQuery.decodeUTF8 is replaced by 'jQuery.fromUTF8'");
			return $.fromUTF8( input );
		}

	});

});