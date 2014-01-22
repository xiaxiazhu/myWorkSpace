/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.support.flash
 */

jQuery.plugin( 'jQuery.support.flash', function( $, undefined ){

	var name = 'Shockwave Flash',
		plugins = navigator.plugins,
		length = plugins.length,
		version = '',
		flash,
		desc;

	if( length ){
		flash = plugins[name];
		if( flash ){
			version = flash.version;
			desc = flash.description;
		}
		else{
			for( var i=0 ; i<length ; i++ ){
				flash = plugins[i].name == name;
				if( flash ){
					version = flash.version;
					desc = flash.description;
					break;
				}
			}
		}

		if( !version && desc ){
			var found = desc.match(/([0-9\.]+)/g);
			version = found ? found[0] : version;
		}
	}
	else {
		for( var i=15; i>3; i-- ) {
			try {
				new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash.'+i );
				version = i+'';
				break;
			}
			catch(error) {
			}
		}
	}

	$.support.flash = version || '';

});