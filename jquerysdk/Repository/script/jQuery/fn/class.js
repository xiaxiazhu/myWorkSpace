/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.class
 */

jQuery.plugin( 'jQuery.fn.class', function( $, undefined ){

	var _hasClass = $.fn.hasClass,
		_removeClass = $.fn.removeClass;

	$.fn.extend({
		hasClass: function( classes ) {
			if( $.type(classes) === 'regexp' ){
				return classes.test( $(this[0]).attr('class') || '' );
			}
			else{
				return _hasClass.call( this, classes );
			}
		},
		removeClass: function( classes ) {
			if( $.type(classes) === 'regexp' ){
				this.each(function(){
					var elem = $(this);

					$.each( (elem.attr('class')||'').split(/\s+/g), function( i, name ){
						if( classes.test(name) )
							_removeClass.call( elem, name );
					});

				});
			}
			else{
				_removeClass.call( this, classes );
			}

			return this;
		}
	});

});