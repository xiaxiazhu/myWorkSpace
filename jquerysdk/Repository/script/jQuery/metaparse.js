/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.metaparse
 */

jQuery.plugin( "jQuery.metaparse", function( $, undefined ){

	var doc = document,

		metaExp = /(?:(?:^|\s+)((?:[\$\w]+)?)((?:\.ready\([^\)]*\))?)(\.[\$\w]+\(.*\)))/,
		readyExp = /^\.ready/,

		doneDepend = $.Deferred().resolve().promise(),
		failDepend = $.Deferred().reject().promise(),

		metaparse = function( data ){
			var meta = {};

			meta.data = data.replace( metaExp, function( m, m1, m2, m3 ){
				meta.depend = m2;
				meta.execute = (m1 || "jQuery") + "(elem)" + m3;

				return "";
			});

			return meta;
		},

		// set internal already parsed status
		isMetaparsed = function( elem, set ){
			return set === undefined ? $._data(elem).metaparsed : ($._data(elem).metaparsed = set);
		},

		// run metaparse automatically on dom ready if defined in config
		runAutoparse = function(){
			$.ready(function(){
				$( autoparse.selector || (typeof autoparse == "string" ? autoparse : ".metaparse") )
					.metaparse({},true);
			});
		},

		autoparse;

	$.extend({
		metaparse: function( elem, settings /*internal*/,isEach ){
			// check whether elem is already parsed
			if( !isMetaparsed(elem) ){
				var s = isEach ? settings : $.extend( {}, $.metaparseSettings, settings ),
					type = s.type,
					name = s.name,
					meta = {},
					execute,
					depend,
					temp;

				if( type === "class" ){
					meta = metaparse(elem.className);
					elem.className = meta.data;
				}
				else if( type === "elem" ){
					if( !elem.getElementsByTagName )
						return;

					if( temp = elem.getElementsByTagName(name)[0] ){
						meta = metaparse(temp.innerHTML);
						temp.innerHTML = meta.data;
					}
				}
				else if( elem.getAttribute != undefined ){
					if( type==="html5" || type==="data" )
						name = "data-"+name;

					if( temp = elem.getAttribute(name) ){
						meta = metaparse(temp);
						elem.setAttribute(name,meta.data);
					}
				}

				// $.globalEval isn't faster then eval this short string
				if( execute = meta.execute ){
					temp = function(){
						isMetaparsed(elem,true);
						eval(execute);
					};

					if(	depend = ((depend = meta.depend) && depend.replace(readyExp,"")) )
						return $.ready( eval(depend), temp );

					temp();
					return doneDepend;
				}
			}

			return failDepend;
		},
		metaparseSettings: $.extend(
			{
				type: "class",
				name: "metaparse"
			},
			$.config.metaparse
		)
	});

	$.fn.extend({
		metaparse: function( settings /*internal*/,isAutoparse ){
			var s = $.extend( {}, $.metaparseSettings, settings ),
				self = this,
				stack = [],
				depend;

			self.each(function(){
					if( !( depend = $.metaparse(this, s, true) ).state() == "rejected" )
						stack.push( depend );
				});

			$.when
				.apply($, stack)
				.done(function(){
					self.each(function(){
						$.event.trigger( "metaparse", null, this, true );
					});

					if( isAutoparse ){
						isMetaparsed(doc,true);
						$(doc).triggerHandler("metaparse");
					}

				});

			return self;
		}
	});

	$.event.special.metaparse = {
		// don't add real event
		setup	: $.noop,

		// add special handler
		add		: function( bind ) {
			// execute handler immediately if elem is already parsed
			if( isMetaparsed(this) )
				bind.handler.call(this,$.Event("metaparse"));

		}
	};

	if( autoparse = $.metaparseSettings.autoparse ){
		if( autoparse.ready )
			$.ready( autoDepend, runAutoparse );
		else
			runAutoparse();

		delete $.metaparseSettings.autoparse;
	}

});