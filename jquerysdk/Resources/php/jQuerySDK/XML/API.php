<?php
namespace jQuerySDK\XML;

use File as File;
use XML\phpQuery as phpQuery;

class API {

	/*
	 * Public
	 */
	public function loadFile( $file ){
		$this->loadString( File::file_read_contents($file) );
	}

	public function loadString( $string ){
		$this->targetXML = phpQuery::newDocumentXML($string);
	}

	public function mergeFile( $file ){
		$this->mergeString( File::file_read_contents($file) );
	}

	public function mergeString( $string ){
		$sourceXML = phpQuery::newDocument($string);

		$sourceXML->find('entries > entry')->appendTo( $this->targetXML->find('entries') );
		$sourceXML->find('plugins > entry')->appendTo( $this->targetXML->find('plugins') );

		$this->mergeCategories( $this->targetXML->find('categories'), $sourceXML->find('categories > category') );
	}
	public function getXML(){
		return $this->targetXML->xml();
	}

	private function mergeCategories( $target, $source ){
		foreach( $source->get() as $sourceNode ){
			$sourceElem = phpQuery::pq($sourceNode);
			$sourceName = $sourceElem->attr('name');
			$sourceTitle = $sourceElem->attr('title');

			$targetElem = $target->children('category[name="'.$sourceName.'"]');

			if( !$targetElem->length ){
				$names = array();
				foreach( $target->children('category')->get() as $targetChild ){
					$names[] = phpQuery::pq($targetChild)->attr('name');
				}
				$names[] = $sourceName;
				sort($names);
				$targetName = $names[ array_search( $sourceName, $names )+1 ];

				if( $targetName ){
					$targetElem = phpQuery::newDocument('<category name="'.$sourceName.'" title="'.$sourceTitle.'"/>')
						->insertBefore( $target->children('category[name="'.$targetName.'"]') );
					$targetElem = $target
						->children('category[name="'.$sourceName.'"]');
				}
				else{
					$targetElem = $target
						->append('<category name="'.$sourceName.'" title="'.$sourceTitle.'"/>')
						->children('category[name="'.$sourceName.'"]');
				}
			}

			$sourceChilds = $sourceElem->children('category');
			if( $sourceChilds->length ){
				$this->mergeCategories( $targetElem, $sourceChilds );
			}
		}
	}
}

?>