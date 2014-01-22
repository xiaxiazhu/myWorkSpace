/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @desc			jQuery.debug.sortPlugins
 */

jQuery.plugin( 'jQuery.debug.sortPlugins', function( $, undefined ){

	var listPlugins = function(){
			var data = {},
				ret = [];


			$.each( $.dependStack._plugin, function( name, deps ){
				var plugins;

				if( !data[ name ] )
					data[ name ] = [];

				switch( $.type(deps) ){
					case 'array':
						plugins = deps;
					break;
					case 'object':
						plugins = deps.plugin || [];
					break;
					case 'string':
						plugins = [deps];
					break;
					default:
						return;
					break;
				}

				$.each( plugins, function( i, dep ){
					if( !data[ dep ] )
						data[ dep ] = [];

					if( $.inArray( name, data[ dep ] )<=0 )
						data[ dep ].push( name );

				});
			});

			$.each( data, function( name, deps ){
				var i = ret.length,
					end;

				$.each( deps, function( k, dep ){
					k = $.inArray( dep, ret );
					i = k!=-1 && k<i ? k : i;
				});

				end = ret.splice( i, ret.length );
				ret.push( name );
				ret.push.apply( ret, end );
			});

			return ret;
		};

	$.extend( $.debug, {
		// get an array of used plugins in the corrent dependencies order
		sortPlugins: function( depends, callback ){
			if( !callback ){
				callback = depends;
				depends = [];
			}

			$.ready( depends, function(){
				callback( listPlugins() );
			});
		}
	});

});