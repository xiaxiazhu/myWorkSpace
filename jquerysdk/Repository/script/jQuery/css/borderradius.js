/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.css.borderradius
 */

jQuery.plugin( 'jQuery.css.borderradius', 'jQuery.support.cssprefix', function( $, undefined ){

	var cssPrefix	= $.support.cssPrefix,
		radiusType	= [ 'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius',  'border-bottom-left-radius' ];

	if( cssPrefix ){
		// set props and hooks for border radius
		$.each( radiusType, function( i, name ) {
			var origName = $.camelCase(name),
				hookName = $.camelCase(
					cssPrefix + (
						cssPrefix==='-moz-' && name!=='border-radius' ?
							'border-radius-'+name.split('-').splice(1,2).join('') :
							name
					)
				);
			// add to cssprops
			$.cssProps[ origName ] = hookName;
			// add to hooks
			$.cssHooks[ origName ] = {
				get: function( elem, computed, extra ){
					var ret = [];

					if( name==='border-radius' ){
						$.each( radiusType, function( j, type ){
							if( j>0 )
								ret.push( $.css( elem, type ) );
						});
					}
					else{
						var tmp = $.css( elem, hookName );
						ret.push( tmp ? tmp.split(' ')[0] : '0px' );
					}

					return ret.join(' ');
				},
				set: function( elem, value ){
					elem.style[ origName ] = value;
					elem.style[ hookName ] = value;
				}
			};
		});
	}

});