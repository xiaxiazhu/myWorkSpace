/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.base64
 */

(function( jQuery, undefined ){

	var deprecated = function(){
			$.extend({
				encodeBASE64: function( input, traditional ){
					$.debug.warn("METHOD DEPRECATED: jQuery.encodeBASE64 is replaced by 'jQuery.toBASE64'");
					return $.toBASE64( input, traditional );
				},
		
				decodeBASE64: function( input, traditional ) {
					$.debug.warn("METHOD DEPRECATED: jQuery.decodeBASE64 is replaced by 'jQuery.fromBASE64'");
					return $.fromBASE64( input, traditional );
				}
			});
		}; 

	if( jQuery.support.base64 = $.isFunction(window.btoa) && $.isFunction(window.atob) ){
		jQuery.plugin("jQuery.base64", ["jQuery.json","jQuery.utf8"], function( $, undefined ){

			$.extend({
		
				toBASE64: function( input, traditional ){
					return window.btoa( $.toUTF8( traditional ? input+"" : $.toJSON(input) ) );
				},
		
				fromBASE64: function( input, traditional ) {
					var output = $.fromUTF8( window.atob( input.replace(/[^A-Za-z0-9\+\/\=]/g, "") ) );
		
					return traditional ? output : $.parseJSON(output);
				}
		
			});
			
			deprecated();
		});
	}
	else{
		jQuery.plugin("jQuery.base64", ["jQuery.json","jQuery.utf8", "jQuery.base64.fix"], deprecated);
	}

})(jQuery);