<?php
namespace CLI;

use CLI as CLI;

class Menu {

	private $menu = array(
		'Main' => array( '[M]ain', 'm' ),
		'Quit' => array( '[Q]uit', 'q' )
	);

	function __construct( $menu ){
		$this->menu['Main'][2] = $this->initalize($menu);
	}

	private function initalize( $menus ){
		$result = array();

		foreach( $menus as $name => $action ){
			preg_match('/\[([A-Za-z0-9])\]/',$name,$key);

			$result[ preg_replace('/(\[|\])/','',$name) ] = array(
				$name,
				strtolower($key[1]),
				!is_array($action) ? $action : $this->initalize($action)
			);
		}

		return $result;
	}

	public function update( $menuPath='Main', $menu ){
		$menuBase = &$this->menu;

		foreach( preg_split('/\s*>\s*/',$menuPath) as $menuName ){
			if( $menuBase[$menuName] )
				$menuBase = &$menuBase[$menuName][2];
			else
				return;
		}

		$menuBase = $this->initalize($menu);
	}

	public function delete( $menuPath='Main' ){
		$menuArray = preg_split('/\s*>\s*/',$menuPath);
		$menuBase = &$this->menu;

		foreach( $menuArray as $menuName ){
			array_shift($menuArray);
			$menuSub = &$menuBase[$menuName];

			if( !$menuSub )
				return;
			elseif( sizeof($menuArray) )
				$menuSub = &$menuSub[2];
			else
				unset($menuBase[$menuName]);

			$menuBase = &$menuSub;
		}
	}

	public function open( $menuPath='Main' ){
		$menuArray = preg_split('/\s*>\s*/',$menuPath);

		$openHandle = array(
			'actions'	=> array(
				'q'			=> 'Quit'
			),
			'breadcrumb'=> array(),
			'pathcrumb'	=> array(),
			'menuitems'	=> array()
		);

		$this->openWalk( array_shift($menuArray), $menuArray, $this->menu, $openHandle );
	}

	private function openWalk( $menuName, $menuArray, $menu, $openHandle ){
		$menuHandle = $menu[ $menuName ];

		// handle error
		if( !$menuHandle ){
			return $this->error('Menu does not exists.');
		}
		// walk
		elseif( sizeof($menuArray) ){
			array_push( $openHandle['breadcrumb'], $menuHandle[0] );
			array_push( $openHandle['pathcrumb'], $menuName );
			$openHandle['actions'][ $menuHandle[1] ] = join( ' > ', $openHandle['pathcrumb'] );

			$this->openWalk( array_shift($menuArray), $menuArray, $menuHandle[2], $openHandle );
		}
		// list
		elseif( is_array($menuHandle[2]) ){
			array_push( $openHandle['breadcrumb'], $menuName );
			array_push( $openHandle['pathcrumb'], $menuName );
			$openHandle['actions'][ $menuHandle[1] ] = join( ' > ', $openHandle['pathcrumb'] );

			foreach( $menuHandle[2] as $subName => $subHandle ){
				$openHandle['actions'][ $subHandle[1] ] = join( ' > ', $openHandle['pathcrumb'] ).' > '.$subName;
				array_push( $openHandle['menuitems'], $subHandle[0] );
			}

			$this->draw($openHandle);
		}
		// call
		elseif( $menuHandle[2] ){
			array_push( $openHandle['pathcrumb'], $menuName );
			$menuHandle[2]( $this, join( ' > ', $openHandle['pathcrumb'] ) );
		}
		// Exit
		else{
			CLI::cli_textBox('Quit');
			exit;
		}
	}

	private function draw( $openHandle ){
		$pathcrumb = join( ' > ', $openHandle['pathcrumb'] );
		$breadcrumb = join( ' > ', $openHandle['breadcrumb'] );
		$menuitems = $openHandle['menuitems'];

		$draw = "";
		$draw .= "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓\n";
		while( strlen($breadcrumb)<67 ){ $breadcrumb .= ' '; }
		$draw .= "┃ $breadcrumb ┃ [Q]uit ┃\n";
		$draw .= "┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━┫\n";
		$draw .= "┃                                                                              ┃\n";
		foreach( $menuitems as $menuitem ){while( strlen($menuitem)<73 ){ $menuitem .= ' '; }
		$draw .= "┃  - $menuitem ┃\n";}
		$draw .= "┃                                                                              ┃\n";
		$draw .= "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n";
		$draw .= "\n";
		$draw .= "Select: ";

		CLI::cli_print($draw);

		for(;;){
			$input = CLI::cli_input();
			if( $input!='' ){
				print "\n";

				$path = $openHandle['actions'][ strtolower($input) ];

				if( $path ){
					$this->open( $path );
				}
				else{
					$this->error('Selected menu is not available.', $pathcrumb);
				}

				break;
			}
		}
	}

	private function error( $type, $path='Main' ){
		CLI::cli_textBox( 'Error: '.$type );
		$this->open($path);
	}
}

?>