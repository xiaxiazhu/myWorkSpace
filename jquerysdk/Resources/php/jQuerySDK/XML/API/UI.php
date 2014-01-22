<?php
namespace jQuerySDK\XML\API;

use File as File;
use String as String;
use XML\phpQuery as phpQuery;

class UI {

	/*
	 * Public
	 */
	function __construct(){
		$this->xml = phpQuery::newDocumentXML('<?xml version="1.0"?><api><categories><category name="plugins" title="Plugins"/><category name="ui" title="UI"/></categories><entries/><plugins/></api>');
	}

	public function parseSite( $src='http://jqueryui.com/demos/accordion' ){
		$site = phpQuery::newDocumentHTML(File::file_read_contents($src));

		$version = '1.0';

		$Name = $site->find('#demo-header > h2')->text();
		$name = strtolower( $Name );
		// plugin Name
		$pluginTitle = 'jQuery.ui.'.$name;
		$pluginName = strtolower($pluginTitle);
		$this->xml
			->find('categories category[name="plugins"]')
			->append('<category name="'.$pluginName.'" title="'.$pluginTitle.'"/>');

		// entry
		$entry = phpQuery::newDocument('<entry/>')
			->find('entry')
			->attr('type','method')
			->attr('name',$name)
			->attr('title','.'.$name.'()')
			->attr('plugin',$pluginName);

		// dependencies
		foreach( $site->find('#overview-dependencies li') as $dependNode ){
			$dependElem = phpQuery::pq($dependNode);

			if( preg_match( '/^UI ([A-Za-z]+)$/', $dependElem->text(), $match ) ){
				$entry->append('<depend name="jQuery.ui.'.strtolower($match[1]).'"/>');
			}
		}
		// desc
		$entry->append('<desc>Apply the '.$Name.' widget for each element in the set of matched elements</desc>');

		// category
		$entry->append('<category name="version-'.$version.'" title="Version '.$version.'"/>');
		$entry->append('<category name="ui" title="UI"/>');

		// signature
		$entry->append('<signature title=".'.$name.'( [ options ] )"><added>'.$version.'</added><argument name="options" type="Map" optional="true"><desc>A map of additional options pass to the widget.</desc></signature>');

		// description
		$entry->append('<longdesc>'.$site->find('#overview-main')->html().'</longdesc>');

		// options
		foreach( $site->find('#options li.option') as $optionNode ){
			$optionElem = phpQuery::pq($optionNode);
			$optionName = trim( $optionElem->find('.option-name')->text() );
			$optionType = trim( preg_replace( '/\s*,\s*/', ',', $optionElem->find('.option-type')->text() ) );
			$optionDefault = htmlspecialchars( trim( preg_replace( '/"/s', '&quot;', $optionElem->find('.option-default')->text() ) ) );
			$optionDesc = trim( $optionElem->find('.option-description p')->html() );

			$entry->append('<option name="'.$optionName.'" type="'.$optionType.'" default="'.$optionDefault.'"><desc>'.$optionDesc.'</desc></option>');
		}

		// event
		foreach( $site->find('#events li.event') as $eventNode ){
			$eventElem = phpQuery::pq($eventNode);
			$eventName = trim( $eventElem->find('.event-name')->text() );
			$eventDesc = trim( $eventElem->find('.event-description p')->html() );

			$entry->append('<event name="'.$eventName.'"><desc>'.$eventDesc.'</desc></event>');
		}

		// method
		foreach( $site->find('#methods li.method') as $methodNode ){
			$methodElem = phpQuery::pq($methodNode);
			$methodName = trim( $methodElem->find('.method-name')->text() );
			$methodLongdesc = trim( $methodElem->find('.method-description')->html() );

			$entry->append('<method name="'.$methodName.'"><longdesc>'.$methodLongdesc.'</longdesc></method>');

			foreach( $methodElem->find('.method-signature')->get() as $signatureNode ){
				$signatureElem = phpQuery::pq($signatureNode);
				$signatureTitle = preg_replace( '/\s+/s', ' ', $signatureElem->html() );
				$signatureTitle = preg_replace( '/"/s', '&quot;', $signatureTitle );
				$entry->find('> method:last')->append('<signature title="'.$signatureTitle.'"><added>'.$version.'</added></signature>');
			}
		}

		// ADD
		$this->xml
			->find('plugins')
			->append($entry);
	}

	public function getXML(){
		return $this->xml->xml();
	}

	/*
	 * Private
	 */

	private function relativeLinks(){
		foreach( $this->xml->find('a[href]')->get() as $node ){
			$elem = phpQuery::pq($node);
			$href = $elem->attr('href');

			$href = preg_replace( '/^(?:\/)(.*)/', '/api/$1', $href );
			$href = preg_replace( '/^http:\/\/api.jquery.com\//', '/api/', $href );
			$href = preg_replace( '/^(?:\/api\/category|\/category).*?(\/[^\/]+)(\/?)$/', '/category$1$2', $href );
			if( !preg_match('/^(https?:|ftp:|\/api|\/category|#)/',$href) ){
				$href = preg_replace( '/^(.)/', '/api/$1', $href );
			}
			$href = preg_replace( '/^\/api\/jquery\./', '/api/jQuery.', $href);
			$href = preg_replace( '/^(\/api|\/category)(.*?)(\/)$/', '$1$2', $href);

			$elem->attr('href',$href);
		};
	}
}

?>