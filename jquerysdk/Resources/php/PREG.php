<?php

class PREG {
	public static function preg_escape( $string ){
		return preg_replace( '/\\//', '\\/', preg_quote($string) );
	}
}

?>