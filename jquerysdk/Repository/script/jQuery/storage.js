/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.storage
 */

jQuery.plugin( 'jQuery.storage', ['jQuery.cookie','jQuery.json'], function( $, undefined ){

	var is = {
			localStorage:	false,
			sessionStorage: false
		};

	$.each( ['localStorage','sessionStorage'], function( i, type ){

		// Firefox die, if cookies are disabled in privacy settings
		try{
			is[ type ] = window[ type ] && window[ type ].setItem;
		}
		catch(error){
		}

		$[ type ] = function( name, value ){
			name = $[ type + 'Settings' ].namespace + name;

			if( value===undefined ){
				var ret = is[type] ?
						window[type].getItem( name ) :
						$.cookie( type+':'+name );
				return (ret===undefined || ret===null) ?
					null :
					$.parseJSON( ret );
			}
			else if( value===null ){
				is[type] ?
					window[type].removeItem( name ) :
					$.cookie( type+':'+name, null, {path:'/',domain:document.domain,expires:-365} );
				return this;
			}
			else{
				value = $.toJSON( value );
				is[type] ?
					window[type].setItem( name, value ) :
					$.cookie( type+':'+name, value, {path:'/',domain:document.domain,expires:type==='localStorage' ? 365 : undefined} );
				return this;
			}
		};

		$[ type + 'Clear' ] = function( deep ) {
			var reg = new RegExp( '^'+(is[type] ? '' : type+':')+(deep ? '' : $[ type + 'Settings' ].namespace), '');

			if( is[type] ){
				if( deep )
					window[type].clear();
				else
					for( var name in window[type] ){
						if( reg.test(name) )
							window[type].removeItem( name );
					}
			}
			else{
				if( document.cookie && document.cookie !== '' ){
					$.each( document.cookie.split(';'), function( i, cookie ){
						if( reg.test(cookie = $.trim(cookie)) )
							 $.cookie( cookie.substr(0,cookie.indexOf('=')), null, {path:'/',domain:document.domain,expires:-365} );
					});
				}
			}

			return this;
		};

		$[ type + 'Settings' ] = $.extend(
			{
				namespace: ''
			},
			$.config.storage
		);

	});

});