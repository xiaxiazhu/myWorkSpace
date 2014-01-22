/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.attr
 */

jQuery.plugin( 'jQuery.fn.attr', function( $, undefined ){

	$.fn.extend({

		// toggle an attribute, works like toggleClass
		toggleAttr: function( attr , valA, valB ) {
			return this.each(
				function() {
					var element = $(this),
						val = element.attr( attr );

					if( val === valA && valB===undefined ) {
						element.removeAttr( attr );
					}
					else if( val === valA ) {
						element.attr( attr , valB );
					}
					else {
						element.attr( attr, valA );
					}
				}
			);
		}
	});

});