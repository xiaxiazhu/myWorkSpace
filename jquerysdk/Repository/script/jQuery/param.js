/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.param
 */

jQuery.plugin( 'jQuery.param', function( $, undefined ){

	var _param = $.param;

	$.extend({
		// param is also (un)param
		param: function( obj, traditional ){
			var ret;

			if( typeof obj === 'string' ){
				ret = {};

				var pairs = obj.replace(/^(\?)/,'').split('&');

				$.each( pairs, function( i, pair ){
					pair = pair.split('=');

					var registers = [],
						name = decodeURIComponent(pair[0]),
						value = decodeURIComponent(pair[1] || ''),
						tmp = ret,
						register;

					name = name.replace( /\[([^\]]*)\]/g, function( all, $1 ){
						registers.push($1);
						return "";
					});

					registers.unshift(name);

					for( var j=0,jL=registers.length-1 ; j<jL ; j++ ){
						register = registers[j];

						var next = registers[j+1];

						if( !tmp[register] )
							tmp[register] = next==='' || (/^[0-9]+$/).test(next) ? [] : {};

						tmp = tmp[register];
					}

					register = registers[jL];

					if( register === "" )
						tmp.push(value);
					else
						tmp[register] = value;
				});
			}
			else if( obj ){
				ret = _param( obj, traditional );
			}

			return ret;
		}
	});

});