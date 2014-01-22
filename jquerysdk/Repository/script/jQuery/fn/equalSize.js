/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.equalSize
 */

jQuery.plugin( 'jQuery.fn.equalSize', 'jQuery.fn.size', function( $, undefined ){

	$.each( [ 'Height', 'Width' ], function( i, Name ){

		// Height => height
		var name = Name.toLowerCase();

		$.each( [ '', 'Inner', 'Outer' ], function( j, Type ){

			// Outer => outer
			var type = Type.toLowerCase();

			// $.fn[ 'equal' + 'Outer' + 'Height' ]
			$.fn[ 'equal' + Type + Name ] = function( margin ){

				margin = Type==='Outer' ? margin : undefined;

				// OuterHeight || height
				var method = Type ? type+Name : name,
					max = 0;

				return this.each(function(){
						var height = margin ? $(this)[ method ](true) : $(this)[ method ]();

						if( height > max ){
							max = height;
						}

					})[ method ]( max, margin );
			};
		});
	});
});