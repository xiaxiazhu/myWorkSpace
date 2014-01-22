<?php

class File {
	private static function get_list( $directory, $recursive=0, &$dirs=array(), &$files=array(), &$links=array() ){
		$handle = opendir($directory);
		while( $entry = readdir($handle) ){
			$subEntry = $directory.self::path_normalize("/").$entry;

			if( preg_match('/^\.\.?$/',$entry) )
				continue;

			if( is_link($subEntry) ){
				array_push( $links, $subEntry );
			}
			if( is_file($subEntry) ){
				array_push( $files, $subEntry );
			}
			if( is_dir($subEntry) ){
				array_push( $dirs, $subEntry );

				if( $recursive ){
					self::get_list( $subEntry, $recursive, $dirs, $files, &$links );
				}
			}
		}
		closedir($handle);

		sort($dirs);
		sort($files);
		sort($links);

		return array(
			'dirs'	=> $dirs,
			'files'	=> $files,
			'links'	=> $links
		);
	}

	private static function syncronize( $source, $target, $sync, $grep_exp, $grep_inv ){
		if( !is_dir($source) )
			return false;

		if( !is_dir($target) )
			mkdir( $target, 0777, true);

		$handle = opendir($source);
		while( $entry = readdir($handle) ){
			$subSource = $source.self::path_normalize("/").$entry;
			$subTarget = $target.self::path_normalize("/").$entry;

			if( preg_match('/^\.\.?$/',$entry) || ( $grep_exp && !( ($grep_inv && !preg_match($grep_exp,$subSource)) || preg_match($grep_exp,$subSource) ) ) )
				continue;

			if( is_dir($subSource) )
				self::syncronize( $subSource, $subTarget, $sync, $grep_exp, $grep_inv );
			elseif( !is_file($subTarget) || $sync==1 || ($sync==2 && filemtime($subSource)>filemtime($subTarget)) )
				copy( $subSource, $subTarget );
		}
		closedir($handle);

		return true;
	}

	public static function dir_get_list( $directory, $recursive=0 ){
		if( !is_dir($directory) )
			return array();

		$list = self::get_list( $directory, $recursive );

		return $list['dirs'];
	}

	public static function file_get_list( $directory, $recursive=0 ){
		if( !is_dir($directory) )
			return array();

		$list = self::get_list( $directory, $recursive );

		return $list['files'];
	}

	public static function link_get_list( $directory, $recursive=0 ){
		if( !is_dir($directory) )
			return array();

		$list = self::get_list( $directory, $recursive );

		return $list['links'];
	}

	public static function file_read_contents( $file ){
		$file = self::path_normalize($file);

		return file_get_contents($file);
	}

	public static function file_write_contents( $file, $content='' ){
		$file = self::path_normalize($file);

		$dir = dirname($file);
		if( !is_dir($dir) )
			mkdir( $dir, 0777, true );

		$open = fopen( $file,'w');
				fwrite($open,$content);
				fclose($open);
	}

	public static function rcopy( $source, $target, $overwrite=0 ){
		return self::syncronize( $source, $target, $overwrite ? 1 : 0, 0, 0 );
	}

	public static function rcopy_grep( $source, $target, $overwrite=0, $grep_exp=0, $grep_inv=0 ){
		return self::syncronize( $source, $target, $overwrite ? 1 : 0, $grep_exp, $grep_inv );
	}

	public static function rsync( $source, $target, $sync=1 ){
		switch( $sync ){
			case 1:
				self::syncronize( $source, $target, 2, 0, 0 );
			break;
			case 0:
				self::syncronize( $source, $target, 2, 0, 0 );
				self::syncronize( $target, $source, 2, 0, 0 );
			break;
			case -1:
				self::syncronize( $target, $source, 2, 0, 0 );
			break;
		}
	}

	public static function rdelete( $directory ) {
		if( is_file($directory) )
			return unlink($directory);

		if( !is_dir($directory) )
			return NULL;

		$list = self::get_list( $directory, 1 );
		foreach( array_reverse($list['files']) as $file ){
			unlink($file);
		}
		foreach( array_reverse($list['dirs']) as $dir ){
			rmdir($dir);
		}
		rmdir($directory);

		return true;
	}

	public static function path_normalize( $path ){
		if( !OS_WIN || preg_match('/^(https?|ftp)\\/\\/:/',$path) ){
			return preg_replace( '/[\\\]/', '/', $path );
		}
		else{
			return preg_replace( '/[\\/]/', '\\', $path );
		}
	}
}

?>