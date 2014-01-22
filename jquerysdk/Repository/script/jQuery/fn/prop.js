/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.prop
 */

jQuery.plugin( 'jQuery.fn.prop', function( $, undefined ){

	$.fn.extend({

		// toggle a property, works like toggleClass
		toggleProp: function( prop , valA, valB ) {
			return this.each(
				function() {
					var element = $(this),
						val = element.prop( prop );

					if( val === valA && valB===undefined ) {
						element.removeProp( prop );
					}
					else if( val === valA ) {
						element.prop( prop , valB );
					}
					else {
						element.prop( prop, valA );
					}
				}
			);
		}
	});

});