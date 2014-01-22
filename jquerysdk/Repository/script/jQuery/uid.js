/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.uid
 */

jQuery.plugin( 'jQuery.uid', function( $, undefined ){

	$.extend({
		uid: function( prefix ) {

			prefix = prefix ? prefix+'_' : 'uid_';

			var generate = function() {
				var uid = prefix + $.guid++;

				return document.getElementById( uid ) ? generate() : uid ;
			};

			return generate();
		}
	});

});