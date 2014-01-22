<?php
namespace jQuerySDK\XML\API;

use File as File;
use String as String;
use XML\phpQuery as phpQuery;

class RAW {

	/*
	 * Initialize
	 */

	private $wasteCategories = array(
		'Plugin Authoring'
	);

	private $pluginMap = array(
		'jQuery Templates' => 'jQuery.tmpl',
		'jQuery Datalink' => 'jQuery.fn.datalink'
	);

	private $versionMap = array(
		'1.0'	=> array('1.0','1.0.4','1.1','1.1.2','1.1.3','1.1.4','1.2','1.2.3','1.2.6','1.3','1.3.2','1.4','1.4.1','1.4.2','1.4.3','1.4.4','1.5','1.5.1','1.6','1.6.1'),
		'1.0.1'	=> array('1.6.2'),
		'1.0.2'	=> array(),
		'1.0.3'	=> array('1.6.3','1.6.4'),
		'1.1'	=> array('1.7'),
		'1.1.1'	=> array('1.7.1'),
		'1.2'	=> array(),
		'1.2.1'	=> array(),
		'1.3'	=> array('1.7.2'),
		'1.3.1'	=> array(),
		'1.4'	=> array('1.8.0')
	);

	private $versionNext = '1.x';

	/*
	 * Public
	 */

	public function parseFile( $src='http://api.jquery.com/api' ){
		$this->parseString( File::file_read_contents($src) );
	}

	public function parseString( $string ){
		$string = preg_replace('/(<\!--[^<>]+-->)$/s','',$string);

		$this->xml = phpQuery::newDocumentXML($string);
		$this->api = $this->xml->find('api:first');

		$this->addEntryTitle();
		$this->optionFromSignatureToEntry();

		$this->addSignatureTitle();

		$this->renamePlugins();
		$this->addPluginsToCategory();
		$this->removeWasteCategories();

		$this->removeWastVersions();
		$this->renameVersions();
		$this->addVersionsToCategoryTree();
		$this->addVersionCategories();
		$this->removeDoubleCategories();

		$this->addCategoryTitle();
		$this->relativeLinks();

	}

	public function getXML(){
		return $this->xml->html();
	}

	public function getImages(){
		$result = array();

		foreach( $this->xml->find('img[src]')->get() as $imgNode ){
			$src = phpQuery::pq($imgNode)->attr('src');
			$location = 'http://api.jquery.com'.$src;

			if( preg_match('/^\\/.*?\.(jpg|jpeg|png|gif)$/',$src) && !in_array($location,$result) )
				$result[] = $location;
		}

		return $result;
	}

	/*
	 * Private
	 */

	private function addEntryTitle(){
		foreach( $this->api->find('entry')->get() as $entryNode ){
			$entry = phpQuery::pq($entryNode);
			$type = $entry->attr('type');
			$name = $entry->attr('name');

			switch( $type ){
				case 'method':
					$name = preg_replace('/^\./', '', $name);
					$title = (preg_match('/\./',$name) || $name=='jQuery' ? '' : '.').$name.'()';
				break;
				case 'property':
					$title = (preg_match('/\./',$name) ? '' : '.').$name;
				break;
				case 'selector':
					$sample = $entry->children('sample')->html();
					if( preg_match( '/^:'.$name.'/', $sample ) ){
						$title = preg_replace('/\(.*?\)/','()',$sample).' Selector';
						$name = $name.'-selector';
					}
					elseif( preg_match( '/^\[/', $sample ) ){
						$title = String::strtoname($name).' Selector '.$sample;
						$name = String::strtominus($name).'-selector';
					}
					else{
						$title = String::strtoname($name).' Selector ("'.$sample.'")';
						$name = String::strtominus($name).'-selector';
					}
				break;
				case 'template-tag':
					$entry->append( phpQuery::newDocument('<sample>'.$name.'</sample>') );
					if( preg_match( '/^{{([A-Za-z]+)/', $name, $match) ){
						$title = '{{'.$match[1].'}} '.String::strtoname($type);
						$name = $type.'-'.$match[1];
					}
					else if( preg_match( '/^\${/', $name) ){
						$title = '${} '.String::strtoname($type);
						$name = $type.'-equal';
					}
				break;
				default:
					$title = $name.' '.String::strtoname($type);
					$name = $type.'-'.$name;
				break;
			}

			$entry->attr( 'name', $name );
			$entry->attr( 'title', $title );
		}
	}

	# not before: $this->addEntryTitle()
	private function addSignatureTitle(){
		foreach( $this->api->find('entry')->get() as $entryNode ){
			$entry = phpQuery::pq($entryNode);
			$signatures = $entry->find('signature');

			$type = $entry->attr('type');
			$name = $entry->attr('name');
			$title = $entry->attr('title');
			$sample = $entry->children('sample');

			foreach( $signatures as $signatureNode ){
				$signature = phpQuery::pq($signatureNode);

				switch( $type ){
					case 'method':
						$args = array();
						foreach( $signature->children('argument') as $argumentNode ){
							$argument = phpQuery::pq($argumentNode);
							array_push( $args, $argument->attr('optional') ? '[ '.$argument->attr('name').' ]' : $argument->attr('name') );
						}
						$args = join( ', ', $args );

						$signature->attr( 'title', $args ? preg_replace('/\(\)/','( '.$args.' )',$title) : $title );
					break;
					case 'property':
						$signature->attr( 'title', $title );
					break;
					case 'selector':
						$signature->attr( 'title', 'jQuery(\''.$sample->html().'\')' );
					break;
					case 'template-tag':
						$signature->attr( 'title', $sample->html() );
					break;
					default:
						$signature->attr( 'title', $title );
					break;
				}
			}

			$sample->remove();
		}
	}

	private function renamePlugins(){
		foreach( $this->api->find('entry[plugin]')->get() as $entryNode ){
			$entry = phpQuery::pq($entryNode);
			$plugin = $entry->attr('plugin');
			$renamed = $this->pluginMap[$plugin];

			$entry->attr('plugin', strtolower($renamed ? $renamed : $plugin) );
		}
	}

	# not before: $this->renameVersions()
	private function addVersionCategories(){
		$categories = array();
		foreach( $this->api->find('entry')->get() as $entryNode ){
			$entry = phpQuery::pq($entryNode);
			foreach( $entry->children('siganture')->get() as $sigantureNode ){
				$siganture = phpQuery::pq($sigantureNode);
				$added = $siganture->children('added');
				if( $added->length )
					$entry->append('<category name="Version '.trim($added->text()).'"/>');
			}
		}
	}

	# not before: $this->addVersionCategories()
	private function removeDoubleCategories(){
		foreach( $this->api->find('entry')->get() as $entryNode ){
			$categories = array();
			$entry = phpQuery::pq($entryNode);
			foreach( $entry->children('category')->get() as $categoryNode ){
				$category = phpQuery::pq($categoryNode);
				$categoryName = $category->attr('name');
				if( $categories[ $categoryName ] ){
					$category->remove();
				}
				else{
					$categories[ $categoryName ] = true;
				}
			}
		}
	}

	# not after: $this->addCategoryTitle()
	private function removeWasteCategories(){
		foreach( $this->wasteCategories as $name ){
			$this->api->find('categories category[name="'.$name.'"]')->remove();
		}
	}

	# not after: $this->addCategoryTitle()
	private function addPluginsToCategory(){
		$this->api->find('categories category[name="Properties"]')->before('<category name="Plugins"/>');
		$plugins = $this->api->find('categories category[name="Plugins"]');

		foreach( $this->pluginMap as $name ){
			$plugins->append('<category name="'.$name.'"/>');
		}
	}

	private function addCategoryTitle(){
		foreach( $this->api->find('category')->get() as $categoryNode ){
			$category = phpQuery::pq($categoryNode);
			$title = $category->attr('name');
			$category->attr( 'name', preg_replace( array('/\ /','/[^a-z0-9\.\-]/'), array('-',''), strtolower(trim($title)) ) );
			$category->attr( 'title', $title );
		}
	}

	# not after: $this->addSignatureTitle()
	private function optionFromSignatureToEntry(){
		foreach( $this->api->find('entry')->get() as $entryNode ){
			$entry = phpQuery::pq($entryNode);

			foreach( $entry->find('option')->get() as $optionNode ){
				$entry->append($optionNode);
			}
		}
		// fix argument name in jQuery.ajax
		$this->api->find('entry[name="jQuery.ajax"] signature argument[name=settings]')->attr('name','options');
	}

	# not after: $this->addCategoryTitle()
	private function removeWastVersions(){
		$this->api->find('category[name="Version"] > category')->remove();
	}

	# not after: $this->addCategoryTitle()
	private function renameVersions(){
		foreach( $this->api->find('added')->get() as $addedNode ){
			$addedElem = phpQuery::pq($addedNode);
			$addedVersion = $addedElem->text();
			$addedVersionNew = $this->versionNext.'';

			foreach( $this->versionMap as $version=>$map ){
				if( in_array($addedVersion, $map) ){
					$addedVersionNew = $version;
					break;
				}
			}
			
			$addedElem->text($addedVersionNew);
		}
		foreach( $this->api->find('entry > category')->get() as $categoryNode ){
			$categoryElem = phpQuery::pq($categoryNode);
			$categoryName = $categoryElem->attr('name');

			if( preg_match('/Version/', $categoryName) ){

				$categoryVersion = preg_replace('/Version\s*/','',$categoryName);
				$categoryVersionNew = $this->versionNext.'';

				foreach( $this->versionMap as $version=>$map ){
					if( in_array($categoryVersion, $map) ){
						$categoryVersionNew = $version.'';
						break;
					}
				}

				$categoryElem->attr('name','Version '.$categoryVersionNew);
			}
		}
	}

	# not after: $this->addCategoryTitle()
	private function addVersionsToCategoryTree(){
		$versionElem = $this->api->find('category[name="Version"]');

		foreach( $this->versionMap as $version=>$map ){
			$versionElem->append('<category name="Version '.$version.'"/>');
		}
	}

	private function relativeLinks(){
		foreach( $this->api->find('a[href]')->get() as $node ){
			$elem = phpQuery::pq($node);
			$href = $elem->attr('href');

				$href = preg_replace( '/^(?:\/)(.*)/',											'api/$1',			$href );
				$href = preg_replace( '/^http:\/\/api.jquery.com\//',							'api/',				$href );
				$href = preg_replace( '/^(?:\/?api\/category|\/?category).*?(\/[^\/]+)(\/?)$/',	'category$1$2',		$href );
			if( !preg_match('/^(https?:|ftp:|\/?api|\/?category|#)/',$href) ){
				$href = preg_replace( '/^(.)/',													'api/$1',			$href );
			}
				$href = preg_replace( '/^\/?api\/jquery\./',									'api/jQuery.',		$href );
				$href = preg_replace( '/^(\/?api|\/?category)(.*?)(\/)$/',						'$1$2',				$href );

			$elem->attr('href',$href);
		};

	}
}

?>