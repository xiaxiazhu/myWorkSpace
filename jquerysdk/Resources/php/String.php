<?php

class String {

	public static function strtominus( $string ){
		$string = preg_replace_callback( '/(^)([a-z])/', 'self::_replace_strtominus', $string );
		$string =  preg_replace_callback( '/([a-z])([A-Z])/', 'self::_replace_strtominus', $string );
		$string =  preg_replace_callback( '/([^A-Za-z])([A-Za-z])/', 'self::_replace_strtominus', $string );
		return strtolower($string);
	}

	public static function strtoname( $string ){
		$string = preg_replace_callback( '/(^)([a-z])/', 'self::_replace_strtoname', $string );
		$string =  preg_replace_callback( '/(.)([A-Z])/', 'self::_replace_strtoname', $string );
		$string =  preg_replace_callback( '/(.)-([A-Za-z])/', 'self::_replace_strtoname', $string );
		return $string;
	}

	# Private Helper
	private static function _replace_strtominus( $args ){
	
		$a = $args[1];
		$b = $args[2];
		return trim($a.($a && $a!='-' ? '-' : '').strtolower($b));
	}
	private static function _replace_strtoname( $args ){
		$a = $args[1];
		$b = $args[2];
		return $a.($a && $a!=' ' ? ' ' : '').strtoupper($b);
	}
}

?>