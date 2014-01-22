/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.compareVersion
 */

jQuery.plugin( 'jQuery.compareVersion', function( $, undefined ){

	var splitExp =	/(\d+)\s*([a-z]+)(\.?)/ig,
		commaExp =	/,/g,
		spaceExp =	/ /g,
		integExp =	/(\D|^$)/

		ext = $.compareVersionSettings = $.extend({
			alpha:	-10,
			a:		-10,
			beta:	-8,
			b:		-8,
			release:-2,
			r:		-2,
			rc:		-4
		}, $.config.compareVersion ),

		split = function( val ){
			return (val+'')
				.toLowerCase()
				.replace( splitExp, function( all, $1, $2, $3 ){
					return $1 + '.' + $2 + $3;
				})
				.replace( commaExp, '.' )
				.replace( spaceExp, '' )
				.split('.');
		},

		toInt = function( val ){
			return parseInt( integExp.test(val) ? (ext[val] || 0) : val , 10 );
		};

	$.compareVersion = function( versionA, versionB ){
		var stackA = split(versionA),
		 	stackB = split(versionB),
		 	l = Math.max( stackA.length, stackB.length );

		for( var i=0 ; i<l ; i++ ){
			var valA = toInt(stackA[i]),
				valB = toInt(stackB[i]);

			if( valA != valB )
				break;
		}

		return valA > valB ?
			1 :
			valA == valB ?
				0 :
				-1;
	};

});