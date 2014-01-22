<?php
namespace jQuerySDK\XML\API;

use File				as File;
use HTML\WIKI 			as WIKI;
use String 				as String;
use XML\phpQuery 		as phpQuery;

class QDoc {
	// QDoc data
	private $stack = '';
	// parse from file
	public function parseFile( $file ){
		$this->parseString( File::file_read_contents($file) );
	}
	// parse from string
	public function parseString( $string ){
		// remove separation line & indent
		$string = trim($string);
		$string = preg_replace( '/(^|\n\r|\r\n|\n|\r)[\ \-]+(\n\r|\r\n|\n|\r|$)/s', "\n", $string );
		$string = preg_replace( '/(^|\n\r|\r\n|\n|\r)[\ \-]+(\n\r|\r\n|\n|\r|$)/s', "\n", $string );
		$string = preg_replace( '/^([\t]{5}|[ ]{20})/m', '', $string );

		$items = preg_split('/(^\s*|\n\r|\r\n|\r|\n)@/', $string);
		foreach( $items as $item ){
			if( preg_match('/^([A-Za-z0-9]+)\s*(.*)$/s',trim($item),$match) ){
				$itemMethod = 'item_'.$match[1];

				if( method_exists($this,$itemMethod) ){
					$this->$itemMethod($match[2]);
				}
			}
		}
	}
	// return API XML
	public function getXML(){
		$xml = phpQuery::newDocumentXML('<?xml version="1.0"?><api>'.utf8_encode($this->stack).'</api>');
		$this->orderXML( $xml->find('api'), 'plugin' );
		$this->orderXML( $xml->find('api > plugin'), 'entry', ':not(depend)' );
		$this->orderXML( $xml->find('api > plugin > entry'), 'signature', 'added, deprecated, removed, argument, return' );
		$this->orderXML( $xml->find('api > plugin > entry'), 'option', 'added, deprecated, removed, default' );
		$this->orderXML( $xml->find('api > plugin > entry'), 'example', 'html, xml, css, js, code, results' );
		$this->orderXML( $xml->find('api > plugin > entry'), 'event', 'added, deprecated, removed' );
		$this->orderXML( $xml->find('api > plugin > entry'), 'method', 'signature, longdesc' );

		$out = phpQuery::newDocumentXML('<?xml version="1.0"?><api><categories><category name="plugins" title="Plugins"/><category name="properties" title="Properties"><category name="properties-of-jqueryconfig" title="Properties of jQueryConfig"/></category></categories><entries/><plugins/></api>');
		$outCore = $out->find('entries');
		$outPlugin = $out->find('plugins');
		$outCategory = $out->find('category[name="plugins"]');
		$outCategoryAdd = 0;

		foreach( $xml->find('api > plugin')->get() as $pluginNode ){
			$pluginElem = phpQuery::pq($pluginNode);
			$pluginName = $pluginElem->attr('name');
			$pluginTitle = $pluginElem->attr('title');
			$dependElems = $pluginElem->find('> depend');
			foreach( $pluginElem->find('> entry')->get() as $entryNode ){
				$entryElem = phpQuery::pq($entryNode);
				$entryVersions = array();

				foreach( $entryElem->find('> signature')->get() as $signatureNode ){
					$signatureElem = phpQuery::pq($signatureNode);
					$signatureReturn = $signatureElem->find('> return');
					if( $signatureReturn->length ){
						$entryElem->attr( 'return', htmlspecialchars($signatureReturn->xml()) );
						$signatureReturn->remove();
					}
				}

				foreach( $entryElem->find('added, deprecated, removed')->get() as $versionNode ){
					$versionElem = phpQuery::pq($versionNode);
					$version = htmlspecialchars( trim( $versionElem->text() ) );
					if( $version )
						$entryVersions[ $version ] = true;
				}

				foreach( $entryVersions as $version=>$state ){
					$entryElem->children('desc')->after('<category name="version-'.$version.'" title="Version '.$version.'"/>');
				}
				foreach( $entryElem->find('> option')->get() as $optionNode ){
					$optionElem = phpQuery::pq($optionNode);
					$optionDefault = $optionElem->find('> default');
					if( $optionDefault->length ){
						$optionElem->attr( 'default', htmlspecialchars($optionDefault->xml()) );
						$optionDefault->remove();
					}
				}

				if( $pluginName=='jquery.core' ){
					$entryElem->appendTo($outCore);
				}
				else{
					$dependElems->clone()->appendTo($entryElem);
					$entryElem->attr('plugin',$pluginName);
					$entryElem->appendTo($outPlugin);
					if( !$outCategoryAdd ){
						$outCategoryAdd = 1;
						$outCategory->append('<category name="'.$pluginName.'" title="'.$pluginTitle.'"/>');
					}
				}
			}
			$outCategoryAdd = 0;
		}

		return $out->xml();
	}
	// order xml sub structure
	private function orderXML( &$xml, $baseSelector, $childSelector='*' ){

		foreach( $xml->children()->get() as $node ){
			$elem = phpQuery::pq($node);

			if( $elem->is($baseSelector) ){
				$base = $elem;
			}
			elseif( $base && $elem->is($childSelector) ){
				$elem->appendTo($base);
			}
			else{
				$base = null;
			}
		}
	}
	// @plugin
	private function item_plugin( $itemData ){
		$this->stack .= '<plugin name="'.strtolower($itemData).'" title="'.$itemData.'"/>';
	}
	// @entry
	private function item_entry( $itemData ){
		$split = preg_split('/\s*\|\s*/',$itemData);

		$call = htmlspecialchars($split[0]);
		$desc = htmlspecialchars($split[1]);
		$type = strtolower( $split[2] ? $split[2] : 'method' );
		$sub = '';

		if( preg_match( '/^([A-Za-z0-9]+)[\t ]+>[\t ]+(.*)/', $split[0], $match ) ){
			$sub = ' sub="'.$match[1].'"';
			$call = htmlspecialchars($match[2]);
		}

		$name = String::strtominus( strtolower($type.'-'.$call) );
		switch( $type ){
			case 'method':
				$name = preg_replace('/^(?:\.?)(.*?)(?:\(\))$/','$1',$call);
				$title = $call;
			break;
			case 'property':
				$name = preg_replace('/^\.?(.*)/','$1',$call);
				$title = $call;
			break;
			case 'selector':
				$name = preg_replace('/^:/','',$call).'-selector';
				$title = $call.' Selector';
			break;
			case 'style':
				$title = '\''.$call.'\' Style Property';
			break;
			case 'event':
				$title = '\''.$call.'\' Special Event';
			break;
			case 'config':
				$title = $call.' Configuration';
			break;
			case 'template-tag':
				$title = $call=='equal' ? '${} Template Tag' : '{{'.$call.'}} Template Tag';
			break;
			default:
				$title = $call;
			break;
		}

		$this->stack .= '<entry type="'.$type.'" name="'.$name.'" title="'.$title.'"'.$sub.'><desc>'.$desc.'</desc></entry>';
	}
	// @dependencies
	private function item_dependencies( $itemData ){
		foreach( preg_split('/\s*\|\s*/',$itemData) as $depend ){
			$this->stack .= '<depend name="'.$depend.'"/>';
		}
	}
	// @categories
	private function item_categories( $itemData ){
		foreach( preg_split('/\s*\|\s*/',$itemData) as $category ){
			$this->stack .= '<category name="'.htmlspecialchars( strtolower( preg_replace('/\s+/','-',$category) ) ).'" title="'.htmlspecialchars($category).'"/>';
		}
	}
	// @signature
	private function item_signature( $itemData ){
		$this->stack .= '<signature title="'.htmlspecialchars($itemData).'"/>';
	}
	// @added
	private function item_added( $itemData ){
		$this->stack .= '<added>'.$itemData.'</added>';
	}
	// @deprected
	private function item_deprecated( $itemData ){
		$this->stack .= '<deprecated>'.$itemData.'</deprecated>';
	}
	// @removed
	private function item_removed( $itemData ){
		$this->stack .= '<removed>'.$itemData.'</removed>';
	}
	// @param
	private function item_param( $itemData ){
		$split = preg_split('/\s*\|\s*/',$itemData);

		$name		= htmlspecialchars($split[0]);
		$desc		= htmlspecialchars($split[1]);
		$optional	= preg_match('/(Optional,|,Optional)/', $split[2]) ? ' optional="true"' : '';
		$type		= htmlspecialchars(preg_replace('/(Optional,|,Optional)/','', $split[2]));

		$this->stack .= '<argument name="'.$name.'" type="'.$type.'"'.$optional.'><desc>'.$desc.'</desc></argument>';
	}
	// @return
	private function item_return( $itemData ){
		$this->stack .= '<return>'.$itemData.'</return>';
	}
	// @description
	private function item_description( $itemData ){
		$this->stack .= '<longdesc>'.WIKI::wiki2html( $itemData, 'QDoc' ).'</longdesc>';
	}
	// @example
	private function item_example( $itemData ){
		$this->stack .= '<example><desc>'.$itemData.'</desc></example>';
	}
	// @html
	private function item_html( $itemData ){
		$this->stack .= '<html><![CDATA['.$itemData.']]></html>';
	}
	// @xml
	private function item_xml( $itemData ){
		$this->stack .= '<xml><![CDATA['.$itemData.']]></xml>';
	}
	// @js
	private function item_js( $itemData ){
		$this->stack .= '<js src="'.$itemData.'"/>';
	}
	// @css
	private function item_css( $itemData ){
		$this->stack .= '<css><![CDATA['.$itemData.']]></css>';
	}
	// @code
	private function item_code( $itemData ){
		$this->stack .= '<code><![CDATA['.$itemData.']]></code>';
	}
	// @results
	private function item_results( $itemData ){
		$this->stack .= '<results><![CDATA['.$itemData.']]></results>';
	}
	// @option
	private function item_option( $itemData ){
		$split = preg_split('/\s*\|\s*/',$itemData);

		$name		= htmlspecialchars($split[0]);
		$desc		= htmlspecialchars($split[1]);
		$optional	= preg_match('/(Optional,|,Optional)/', $split[2]) ? 'true' : 'false';
		$type		= preg_replace('/(Optional,|,Optional)/','', $split[2]);

		$this->stack .= '<option name="'.$name.'" type="'.$type.'" optional="'.$optional.'"><desc>'.$desc.'</desc></option>';
	}
	// @default
	private function item_default( $itemData ){
		$this->stack .= '<default>'.$itemData.'</default>';
	}
	// @event
	private function item_event( $itemData ){
		$split = preg_split('/\s*\|\s*/',$itemData);

		$name		= htmlspecialchars($split[0]);
		$desc		= htmlspecialchars($split[1]);

		$this->stack .= '<event name="'.$name.'"><desc>'.$desc.'</desc></event>';
	}
	// @method
	private function item_method( $itemData ){
		$split = preg_split('/\s*\|\s*/',$itemData);

		$name = htmlspecialchars($split[0]);
		$desc = htmlspecialchars($split[1]);

		$this->stack .= '<method name="'.$name.'"><desc>'.$desc.'</desc></method>';
	}

	// @module		-->		@plugin
	private function item_module( $itemData ){
		$this->item_plugin( $itemData );
	}
	// @syntax		-->		@signature
	private function item_syntax( $itemData ){
		$this->item_signature( $itemData );
	}
	// @function	-->		@entry
	private function item_function( $itemData ){
		$this->item_entry( $itemData );
	}
}
?>