/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.text
 */

jQuery.plugin( 'jQuery.fn.text', function( $, undefined ){

	var _fn_text = $.fn.text;

	$.fn.extend({
		text: function( value ){
			var ret = [];

			if( value===true ){
				$.each( this[0] ? this[0].childNodes : [], function(){
					var type = this.nodeType
					if( type===3 || type===8 )
						ret.push( this.nodeValue );
				});
				ret = ret.join(' ');
			}
			else{
				ret = (value===undefined || value===false) ? _fn_text.call(this) : _fn_text.call(this, value);
			}

			return ret;
		}
	});

});