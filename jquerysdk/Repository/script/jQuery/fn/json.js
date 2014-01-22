/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @based			jQuery XML to JSON Plugin (http://www.fyneworks.com/jquery/xml-to-json) license (http://en.wikipedia.org/wiki/MIT_License and http://www.gnu.org/licenses/gpl-2.0.html)
 *
 * @plugin			jQuery.fn.json
 */

jQuery.plugin( 'jQuery.fn.json', ['jQuery.xml','jQuery.json'], function( $, undefined ){

	$.fn.extend({
		toJSON: function( options ){
			var firstNode = this[0],
				ret = null,
				o = $.extend({
					extended:	false,
					camelCase:	false,
					multiple:	'',
					cdata:		'',
					getObject:	false
				},options);

			if( firstNode ){
				ret = node2data( firstNode, o );
			}

			if( !o.getObject ){
				ret = $.toJSON(ret);
			}

			return ret;
		}
	});

	var node2data = function( domNode, o ) {

			var readCDATA = $.isXMLDoc(domNode) ? 'xml' : 'html',

				parseDOM = function( node, simple ){
					if(!node)
						return null;

					var out,
						txt = [],
						obj = null,
						attrs = null,
						elem = $(node),
						type = node.nodeType,
						name = $.camelCase(node.localName || node.nodeName),
						value = node.text || node.nodeValue || '';

					if( o.cdata && elem.is(o.cdata) ){
						// handle content as CDATA
						txt.push( elem[ readCDATA ]() );
					}
					else if( node.childNodes && node.childNodes.length>0 ){
						// walk childNodes
						$.each( node.childNodes, function( i, childNode ){
							var childElem = $(childNode),
								childType = childNode.nodeType,
								childName = o.camelCase ? $.camelCase(childNode.localName || childNode.nodeName) : childNode.localName || childNode.nodeName,
								childValue = childNode.text || childNode.nodeValue || '';

							if( childType === 8 ){
								return; // ignore comment node
							}
							else if( childType === 3 || childType === 4 || !childName ){
								// ignore white-space in between tags
								if( (/^\s+$/).test(childValue) ){
									return;
								}

								txt.push( $.trim(childValue) ); // make sure we ditch trailing spaces from markup
							}
							else{
								obj = obj || {};
								if( obj[childName] ){
							 		obj[childName] = myArr( obj[childName] );
							 		obj[childName].push( parseDOM( childNode, true /* simple */ ) );
								}
								else if( o.multiple && childElem.is(o.multiple) ){
									obj[childName] = myArr( parseDOM(childNode) );
								}
								else{
									obj[childName] = parseDOM(childNode);
								}
							}
						});
			 		}

					if( node.attributes ){
						if( node.attributes.length>0 ){
							attrs = {};
							obj = obj || {};

							$.each( node.attributes, function( i, attr ){
								var attrName = o.camelCase ? $.camelCase(attr.name) : attr.name,
								 	attrValue = attr.value;

								attrs[attrName] = attrValue;

								if(obj[attrName]){

									if(!obj[attrName].length)
										obj[attrName] = myArr( obj[attrName] );

									obj[attrName].push(attrValue);
								}
								else{
									obj[attrName] = attrValue;
								}
							});
						}
					}

					// merge txt
					txt = obj && obj.text ?
						$.merge( $.isArray(obj.text) ? obj.text : [obj.text], txt ) :
						txt;

					if(obj){
						obj.text = txt.length<=1 ? txt.join('') : txt;
						// remove if emty text
						if( !obj.text ){
							delete obj.text;
						}
						txt = '';
					}
					else{
						txt = txt.join(' ');
					}

					out = obj || txt;

					if( o.extended ){
						if( txt )
							out = {};//new String(out);

						if( (txt = out.text || txt) && !$.isArray(out.text = txt) )
							out.text = [out.text];

						if(!simple)
							out = myArr(out);

					}

					return out;
				};

			if( !domNode )
				return {}; // quick fail

			// Quick fail if not xml/html (or if this is a node)
			if( !domNode.nodeType )
			 	return;

			// Quicl return if text or cdata node
			if( domNode.nodeType === 3 || domNode.nodeType === 4 )
			 	return domNode.nodeValue;

			// Send output
			return parseDOM( domNode, true /* simple */ );
		},

	 	myArr = function( obj ){
			if( !$.isArray(obj) )
				obj = [ obj ];

			return obj; // here is where you can attach additional functionality, such as searching and sorting...
		};

});