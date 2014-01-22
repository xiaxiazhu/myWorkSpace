/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.support.cssprefix
 */

jQuery.plugin( 'jQuery.support.cssprefix', function( $, undefined ){

	var cssPrefix = '';

	// add browser engine name as class to html tag
	if( (/khtml/i).test(navigator.userAgent) )
		cssPrefix = '-khtml-';

	$.each( {'mozilla':'-moz-', 'msie':'-ms-', 'webkit':'-webkit-', 'opera':'-o-'}, function( i, name ){
		if( $.browser[i] ){
			cssPrefix = name;
			return false;
		}
	});

	$.support.cssPrefix = cssPrefix;
});