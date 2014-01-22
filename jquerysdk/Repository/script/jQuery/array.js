/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.array
 */

jQuery.plugin( 'jQuery.array', function( $, undefined ){

	var arrayProto = Array.prototype,
		splice = arrayProto.splice,
		push = arrayProto.push,
		add;

	// reverse method to splice, works with arrays and array-like objects
	$.unsplice = function( target, insert, i ){
		push.apply( add = [isNaN(i) ? target.length : i, 0], !$.isArray(insert) ? $.merge([],insert) : insert );
		splice.apply( target, add );
		
		return target;
	};
});