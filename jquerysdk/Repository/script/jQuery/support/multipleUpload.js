/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.support.multipleUpload
 */

jQuery.plugin( 'jQuery.support.multipleUpload', function( $, undefined ){

	var file = document.createElement('input');

	file.setAttribute('type','file');

	$.support.multipleUpload = !!file.files;

});