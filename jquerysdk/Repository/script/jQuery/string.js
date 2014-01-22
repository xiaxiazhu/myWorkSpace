/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.string
 */

jQuery.plugin( 'jQuery.string', function( $, undefined ){

	var revExp = /(.)/g,

		escExp = /([\.$?*|{}\(\)\[\]\\\/\+^])/g,

		tagsExp = /<.[^<>]*?>/g,

		shrinkExp = / /,
		
		andExp = /&/g,

		htmlExp = [
			/(<|>|")/g,
			/(<|>|')/g,
			/(<|>|'|")/g
		],

		htmlCharMap = {
			'<':'&lt;',
			'>':'&gt;',
			"'":'&#039;',
			'"':'&quot;'
		},

		htmlReplace = function( all, $1 ){
			return htmlCharMap[ $1 ];
		};

	$.extend({

		// reverse a string or number
		reverse: function( string ) {
			var ret = '';

			(string+'').replace( revExp, function( ch ){
				ret = ch+ret;
			});

			return ret;
		},

		// escape reserved regular expression chars in string
		escExpStr: function( string, except ){
			return string.replace( escExp, function( ch ){
				return except && except.indexOf(ch) !== -1 ? ch : "\\" + ch;
			});
		},

		// remove html/xml tags
		stripTags: function( string ) {
			return string.replace( tagsExp, ' ' );
		},

		// convert special html characters
		htmlspecialchars: function( string, quot ){
			return string.replace( andExp, '&amp;' ).replace( htmlExp[ quot || 0 ], htmlReplace );
		},

		// default settings for shrink
		shrinkSettings: $.extend({
			length:		50,
			ratio:		1,
			cut:		true,
			spacer:		'...'
		}, $.config.shrink ),

		// shrink a text [ fulltext... , full...text , ...fulltext ]
		shrink: function( text, options ) {
			var o = $.extend( {}, $.shrinkSettings, isNaN(options) ? options : {length:options} ),
				textL = text.length,
				maxL = o.length - o.spacer.length,
				txt = '';

			// nothing to shrink
			if( textL <= o.length )
				return text;

			// ...fulltext
			if( o.ratio===0 ) {
				txt = text.substr( textL-maxL, maxL );

				return o.spacer + (
						!o.cut && text.charAt(textL-maxL)!==' ' ?
						shrinkExp.test(txt) ? txt.substr( txt.indexOf(' ')+1 ) : '' :
						txt
					);
			}
			// fulltext...
			if( o.ratio===1 ){
				txt = text.substr( 0, maxL );

				return (
						!o.cut && text.charAt(textL)!==' ' ?
						shrinkExp.test(txt) ? txt.substr( 0, txt.lastIndexOf(' ') ) : '' :
						txt
					) + o.spacer;
			}

			// full...text
			txt = $.shrink( text, {
					length:	Math.floor( maxL * o.ratio ),
					ratio:	1,
					cut:	o.cut,
					spacer:	''
				});

			return txt + $.shrink( text, {
					length: o.length - txt.length + o.spacer.length,
					ratio:	0,
					cut:	o.cut,
					spacer:	o.spacer
				});
		}
	});

});