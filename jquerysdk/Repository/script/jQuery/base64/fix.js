/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.base64.fix
 */

jQuery.plugin("jQuery.base64.fix", ["jQuery.json","jQuery.utf8"], function( $, undefined ){

	//private module variable
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	$.extend({

		toBASE64: function( input, traditional ){
			input = $.toUTF8( traditional ? input+"" : $.toJSON(input) );

			var output = "",
				chr1,
				chr2,
				chr3,
				enc1,
				enc2,
				enc3,
				enc4,
				i = 0;
				
			while( i < input.length ){
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			}
			return output;
		},

		fromBASE64: function( input, traditional ) {
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			var output = "",
				chr1,
				chr2,
				chr3,
				enc1,
				enc2,
				enc3,
				enc4,
				i = 0;

			while( i < input.length ){
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 !== 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 !== 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
				
			output = $.fromUTF8(output);

			return traditional ? output : $.fromJSON(output);
		}

	});

});