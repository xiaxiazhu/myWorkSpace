<?php

class CLI {

	public static function textBox( $text, $style='default' ){
		switch( $style ){
			case 'dotted':
				return self::textBox_dotted( $text );
			case 'double':
				return self::textBox_double( $text );
			default:
				return self::textBox_default( $text );
		}
	}

	private static function textBox_dotted( $text ){
		$result = "";
		$result .= "┏┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┓\n";
		foreach( split( "\n", $text ) as $line ){ while( strlen($line)<76 ){ $line .= " "; }
		$result .= "┋ $line ┋\n";}
		$result .= "┗┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┛\n";

		return $result;
	}

	private static function textBox_double( $text ){
		$result = "";
		$result .= "╔══════════════════════════════════════════════════════════════════════════════╗\n";
		foreach( split( "\n", $text ) as $line ){ while( strlen($line)<76 ){ $line .= " "; }
		$result .= "║ $line ║\n";}
		$result .= "╚══════════════════════════════════════════════════════════════════════════════╝\n";

		return $result;
	}

	private static function textBox_default( $text ){
		$result = "";
		$result .= "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n";
		foreach( split( "\n", $text ) as $line ){ while( strlen($line)<76 ){ $line .= " "; }
		$result .= "┃ $line ┃\n";}
		$result .= "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n";

		return $result;
	}

	public static function cli_input( $trim=true ) {
		$fp = fopen("php://stdin", "w");
		$c = fread($fp, 2048);
		fclose($fp);

		return $trim ? trim($c) : $c;
	}

	public static function cli_question( $text, $callback, $context=NULL ){
		print "\n$text";
		for(;;){
			$input = self::cli_input(false);
			if( $input ){
				print "\n";
				$callback( $input, $context );
				break;
			}
		}
	}
	
	public static function cli_textBox( $text, $style='default' ){
		self::cli_print( self::textBox( $text, $style ) );
	}

	public static function cli_print( $string='' ){
		// windows doesn't some characters
		if( OS_WIN ){
			$string = preg_replace( '/(┉|┋|═|║|╔|╗|╚|╝|━|┃|┏|┓|┗|┛|┣|┫|┳|┻)/', '*', $string);
			$string = preg_replace( '/([^\n]{80})\n(?!\n?$)/', '$1', $string);
		}

		print $string;
	}
}

?>