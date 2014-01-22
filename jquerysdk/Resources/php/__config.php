<?php

class __config {
	public static function use_autoload( $class ){
		if( preg_match('/[\.\:]/',$class) )
			return;

		$class = preg_replace('/\\\/','/',$class);

		if( file_exists(__LIB__.'/'.$class.'.php') )
			include_once( __LIB__.'/'.$class.'.php' );
	}

	public static function getArg(){
		global $argv;

		$result = array();

		if( $argv ){
			foreach( $argv as $arg ){
				if( ereg('^--?([^ ]+) (.*)$',$arg,$reg) ){
					$result[$reg[1]] = $reg[2];
				}
				elseif( ereg('^--?([^ ]+)$',$arg,$reg) ){
					$result[$reg[1]] = true;
				}
				elseif( ereg('^([^\-].*)$',$arg,$reg) ){
					$result[''] = $reg[1];
				}
			}
		}

		return $result;
	}
}


// Define global Constants
if( strtoupper(substr(PHP_OS, 0, 3))==='WIN' && strtoupper(PHP_OS)!=='DARWIN' ){
	define( 'OS_WIN'			,1									);
	define( 'OS_UNIX'			,0									);
}
else{
	define( 'OS_WIN'			,0									);
	define( 'OS_UNIX'			,1									);
}
	define( '__0__'				,$argv && $argv[0] ? $argv[0] : ''	);
	define( '__LIB__'			,dirname(__FILE__)					);


// Define Class autoload
function __autoload( $class ){
	return call_user_func_array( array('__config', 'use_autoload'), func_get_args() );
}

// Setup GLOBALS
$GLOBALS['_SERVER']		= $_SERVER;
$GLOBALS['_GET']		= $_GET;
$GLOBALS['_POST']		= $_POST;
$GLOBALS['_FILES']		= $_FILES;
$GLOBALS['_COOKIE']		= $_COOKIE;
$GLOBALS['_SESSION']	= isset($_SESSION) ? $_SESSION : array();
$GLOBALS['_REQUEST']	= $_REQUEST;
$GLOBALS['_ENV']		= $_ENV;

$GLOBALS['_ARG']		= $_ARG			= __config::getArg();
$GLOBALS['_COOKIE']		= $_COOKIE;
$GLOBALS['_ERROR']		= $_ERROR		= isset($php_errormsg) ? $php_errormsg : array();
$GLOBALS['_RAW_POST']	= $_RAW_POST	= isset($HTTP_RAW_POST_DATA) ? $HTTP_RAW_POST_DATA : array();
$GLOBALS['_HEADER']		= $_HEADER		= isset($http_response_header) ? $http_response_header : array();

?>