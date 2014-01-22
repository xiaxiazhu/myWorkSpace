/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.dict
 */

jQuery.plugin( 'jQuery.dict', function( $, undefined ){

		// split name to dict informations
	var dictInfo = function( dict ){
			var temp = dict.split(':'),
				info = {
					dict:	dict,
					region:	temp[1] ? temp.shift() : $.dictSettings.region,
					name:	temp.join(':')
				};

			info.id = info.region+':'+info.name;

			return info;
		},

		// text replace
		parseNode = function( node, dict, deep ){
			if( node.nodeType===3 )
				node.nodeValue = dict.parse( node.nodeValue );
			else if( deep )
				$.each( node.childNodes, function(){
					parseNode( this, dict, deep );
				});
		};

		// local scope of dependencies controller settings
		dependSettings = $.dependSettings;

	$.extend({
		// call dict instance
		dict: function( dict, options ) {
			var o,
				info,
				data;

			if( typeof dict === 'string' ){
				info = dictInfo(dict);
				o = $.extend( {}, $.dictSettings, {region:info.region}, options );
				data = $.dict[ o.region+':'+info.name ] || {};
			}
			else{
				o = $.extend( {}, $.dictSettings, options );
				data = dict || {};
			}

			return new $.Dictionary( data, o );
		},
		// build dict hash
		dictionary: function( dict, data ){
			var mix = [{}],
				ret = {},
				info = {};

			// anonymous dict
			if( data===undefined ){
				data = dict;
			}
			// named dict
			else{
				info = dictInfo(dict);
				mix = [ $.dict[ info.id ] || {} ];
			}

			// create stack
			$.each( $.isArray(data) ? data : [data], function( i, data ){
				if( $.isPlainObject(data) ){
					mix.push( data );
				}
				else if( typeof data==='string' ){
					var dataInfo = dictInfo(data);
					mix.push( $.dict[ (info.region || dataInfo.region)+':'+dataInfo.name ] || {} );
				}
				else if( data instanceof $.Dictionary ){
					mix.push( data.dict );
				}
			});

			// merge stack
			ret = $.extend.apply( {}, mix );

			return info.id ? ($.dict[ info.id ] = ret) : ret;
		},
		// dict settings
		dictSettings: $.extend(
			{
				parser: /(?:^|[^\{\$])(\{(.*?[^\\])\})/g,
				region: 'en'
			},
			$.config.dict
		),
		// dict Class
		Dictionary: function( dict, settings ){
			this.dict = dict;
			this.settings = settings;
		}
	});

	// Class methods of dict
	$.extend( $.Dictionary.prototype, {
		translate: function( key ){
			return this.dict[ key ] || this.parse(key);
		},
		parse: function( string ) {
			var dict = this.dict;
			return string.replace( this.settings.parser, function( all, $1, $2 ){
					var ret = dict[ $2 ];
					return ret===undefined ? all : all.replace($1,ret);
				});
		}

	});

	// add dict as dom manipulation method
	$.fn.extend({
		dictParse: function( dict, deep, options ){
			// init dict object
			dict = dict instanceof $.Dictionary ? dict : $.dict( dict, options );
			// init recursive parsing
			if( typeof deep !== 'boolean' ){
				options = deep;
				deep = false;
			}
			// parse DOM content
			this.contents()
				.each(function(){
					parseNode( this, dict, deep );
				});
			return this;
		}
	});

	// set dict root directory
	if( !dependSettings.dictRoot )
		dependSettings.dictRoot = dependSettings.pluginRoot;

	// register dict for dependencies control
	$.dependRegister( 'dict', function( depend, deferred ){
		var info = dictInfo(depend),
			dependId = info.id,
			dict = $.dict[ dependId ];

		if( dict || (depend != dependId && $.dependStack.dict[ dependId ]) ){
			deferred.resolve();
		}
		else{
			var ajax = {
					url:		dependSettings.dictRoot+'/'+info.name.replace(/\./g,'/')+'.'+info.region+(dependSettings.minify?'.min':'')+'.json',
					dataType:	'json',
					type:		'get',
					asnyc:		true,
					cache:		true
				};

			$.ajax(
				dependSettings.jsonp ?
				$.extend(ajax,{
					dataType:		'jsonp',
					jsonp:			dependSettings.jsonp!==true ? dependSettings.jsonp : undefined,
					jsonpCallback:	'jsonp.dependHandle.dict('+dependId+')'
				}) :
				ajax
			)
			.done(function( data ){
				$.dictionary( dependId, data );
				deferred.resolve();
			});
		}
	});

	/*!BUILD(dict)*/

});