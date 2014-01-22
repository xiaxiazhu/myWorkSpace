<?php
namespace jQuerySDK;

use Arr						as Arr;
use File					as File;
use PREG					as PREG;

class Build {

	/*
	 * Initialize
	 */

	private $projectRoot;

	private $buildRoot;
	private $buildRootJS;
	private $buildRootCSS;
	private $buildConfig = array();

	private $errors = array();

	// $projectsRoot must be an absolute path
	function __construct( $project, $projectsRoot  ){
		$this->projectRoot	= File::path_normalize($projectsRoot.'/'.$project);

		$this->buildRoot	= File::path_normalize($this->projectRoot.'.build');
		$this->buildRootJS	= File::path_normalize($this->buildRoot.'/script');
		$this->buildRootCSS	= File::path_normalize($this->buildRoot.'/style');
		$this->buildConfig	= array();
	}

	/*
	 * Public
	 */

	// $repositoryRoot must be an absolute path
	public function updateRepositoryLinks( $repositoryRoot ){
		// copy with rsync if symlink not supported (Windows)
		if( !function_exists('symlink') ){
			File::rsync( $repositoryRoot, $this->projectRoot );
			return;
		};

		// walk each
		foreach( File::dir_get_list($repositoryRoot) as $repositoryDir ){
			$projectDir = File::path_normalize($this->projectRoot.'/'.basename($repositoryDir));

			if( !is_dir($projectDir) )
				mkdir( $projectDir, 0777 );

			// remove broken symbolic links
			foreach( File::link_get_list($projectDir) as $link ){
				if( !is_readable($link) )
					unlink($link);
			};
			// update symbolic links
			foreach( array_merge(File::dir_get_list($repositoryDir),File::file_get_list($repositoryDir)) as $dir ){
				$dir = basename($dir);

				$projectDirItem = File::path_normalize($projectDir.'/'.$dir);
				$repositoryDirItem = File::path_normalize($repositoryDir.'/'.$dir);

				if( !is_dir($projectDirItem) && !is_file($projectDirItem) ){
					symlink( $repositoryDirItem , $projectDirItem );
				}
			}
		}
	}

	// $demoRoot should be an absolute path
	public function copyDemoProject( $demoRoot ){
		File::rcopy( $demoRoot, $this->projectRoot );
	}

	public function buildProject(){
		$this->errors	= array();

		// delete and create buildRoot
		File::rdelete( $this->buildRoot );
		mkdir( $this->buildRoot, 0777 );

		// copy files to buildRoot
		File::rcopy_grep( $this->projectRoot, $this->buildRoot, 1, '/^'.PREG::preg_escape(File::path_normalize($this->projectRoot)).'['.PREG::preg_escape(File::path_normalize('/')).'](?!qunit|qdoc)/' );
		
		// Javascript Packeges
		foreach( preg_grep('/(?!\.min)\.js$/',File::file_get_list($this->buildRootJS.'/pkg')) as $jsFile ){
			// content of packege file
			$content = File::file_read_contents($jsFile);

			// parse config from content
			if( preg_match( '/\/\*!?CONFIG\((.*?)\)\*\//s', $content, $match ) ){
				$content = preg_replace( '/\/\*!?CONFIG\((.*?)\)\*\//s', '', $content );
				$this->buildConfig = json_decode( preg_replace('/\s+/','',$match[1]), true );
			}
			else{
				$this->buildConfig = array();
			}
			// init config
			$this->buildConfig = Arr::array_rmerge(array('depend'=>array('pluginRoot'=>'script')),$this->buildConfig);
			if( !$this->buildConfig['depend']['tmplRoot'] )
				$this->buildConfig['depend']['tmplRoot'] = $this->buildConfig['depend']['pluginRoot'];
			if( !$this->buildConfig['depend']['dictRoot'] )
				$this->buildConfig['depend']['dictRoot'] = $this->buildConfig['depend']['pluginRoot'];
			if( !$this->buildConfig['depend']['i18nRoot'] )
				$this->buildConfig['depend']['i18nRoot'] = $this->buildConfig['depend']['pluginRoot'].'/jQuery/i18n';

			// replace packege placeholder
			$content = preg_replace_callback( '/\/\*!?PKG\((.*?)\)\*\//s', array(&$this,'replace_JS'), $content );

			// rewrite packege file
			File::file_write_contents( $jsFile, $content );
		}
		// CSS Packeges
		foreach( preg_grep('/(?!\.min)\.css$/',File::file_get_list(File::path_normalize($this->buildRootCSS.'/pkg'))) as $cssFile ){
			// content of packege file
			$content = File::file_read_contents($cssFile);

			// replace packege imports
			$content = preg_replace_callback( '/@import\s+(?:url\("?|")((?!https?:\/\/|\/\/)[^\r\n]*?)(?:(?:"?\)|");?)/s', array(&$this,'replace_CSS'), $content );
			// move other imports on top
			if( preg_match_all( '/@import\s+(?:url\("?|")(?:[^\r\n]*?)(?:(?:"?\)|");?)/s', $content, $map ) ){
				$content = "\n".preg_replace( '/@import\s+(?:url\("?|")(?:[^\r\n]*?)(?:(?:"?\)|");?)/s', '', $content );
				foreach( $map[0] as $all ){
					$content = $all."\n".$content;
				}
			}

			// rewrite packege file
			File::file_write_contents( $cssFile, $content );
		}
		// Minify
		$errors = self::minify($this->buildRoot);

		// Result
		return Arr::array_rmerge( $this->errors, $errors );
	}

	/*
	 * Private
	 */

	// Replace PKG in Javascript
	private function replace_JS( $match ){
		$data = array(
			"plugin"=> array(),
			"tmpl"	=> array(),
			"dict"	=> array(),
			"i18n"	=> array()
		);

		$pluginDir	= File::path_normalize($this->buildRoot.'/'.$this->buildConfig['depend']['pluginRoot']);
		$tmplDir	= File::path_normalize($this->buildRoot.'/'.$this->buildConfig['depend']['tmplRoot']);
		$dictDir	= File::path_normalize($this->buildRoot.'/'.$this->buildConfig['depend']['dictRoot']);
		$i18nDir	= File::path_normalize($this->buildRoot.'/'.$this->buildConfig['depend']['i18nRoot']);

		foreach( json_decode( preg_replace('/\s+/','',$match[1]), true ) as $type=>$depends ){
			// walk depends of each type
			foreach( is_array($depends) ? $depends : array($depends) as $depend ){
				$add = NULL;

				switch( $type ){
					case 'plugin':
						$inclFile = File::path_normalize($pluginDir.'/'.preg_replace('/\./','/',$depend).'.js');
						if( is_file($inclFile) ){
							$add = File::file_read_contents( $inclFile );
						}
					break;
					case 'tmpl':
						$inclFile = File::path_normalize($tmplDir.'/'.preg_replace('/\./','/',$depend).'.tmpl.html');
						if( is_file($inclFile) ){
							$add = File::file_read_contents( $inclFile );
							$add = preg_replace( '/\r?\n/s', '', $add );
							$add = preg_replace( '/\'/s', '\\\'', $add );
							$add = "$.template('$depend','$add');";
						}
					break;
					case 'dict':
						$split = split(':',$depend);
						$region = $split[1] ? array_shift($split) : 'en';

						$inclFile = File::path_normalize($dictDir.'/'.preg_replace('/\./','/',join(':',$split)).'.'.$region.'.json');
						if( is_file($inclFile) ){
							$add = File::file_read_contents( $inclFile );
							$add = "$.dictionary('$depend',[$add]);";
						}
					break;
					case 'i18n':
						$inclFile = File::path_normalize($i18nDir.'/'.$depend.'.js');
						if( is_file($inclFile) ){
							$add = File::file_read_contents( $inclFile );
						}
					break;
				}

				if( $add ){
					$data[ $type ][] = $add;
				}
				else{
					$this->errors[] = 'PKG: '.$inclFile;
				}
			}
		}

		$repl = join("\n\n",$data['plugin'])."\n\n";
		$repl = preg_replace( '/\/\*!?BUILD\(tmpl\)\*\//', join("\n\n",$data['tmpl'])."\n\n\t/*!BUILD(tmpl)*/", $repl, 1);
		$repl = preg_replace( '/\/\*!?BUILD\(dict\)\*\//', join("\n\n",$data['dict'])."\n\n\t/*!BUILD(dict)*/", $repl, 1);
		$repl = preg_replace( '/\/\*!?BUILD\(i18n\)\*\//', join("\n\n",$data['i18n'])."\n\n\t/*!BUILD(i18n)*/", $repl, 1);

		return $repl;
	}

	// Replace import in CSS
	private function replace_CSS( $match ){
		$importFile		= File::path_normalize($this->buildRootCSS.'/pkg/'.$match[1]);
		$importDir		= dirname($importFile);
		$importDir		= preg_replace( '/^'.PREG::preg_escape(File::path_normalize($this->buildRootCSS.'/pkg')).'\/?/', '', $importDir );

		return is_file($importFile) ? preg_replace( '/(?:(?!@import\s*)(url\("?)((?!http:\/\/|\/\/)[^\r\n]*?)("?\)))/', '$1'.$importDir.'/$2$3', File::file_read_contents($importFile) ) : $importFile;
	}

	/*
	 * Static
	 */

	// Build minified files
	public static function minify( $directory ){
		$javaRoot = preg_replace( '/ /', '\ ', __LIB__.'/../java' );

		$errors = array();

		foreach( preg_grep('/^'.preg_replace('/\//','\\/',$directory).'[\\/](?!qunit)(.(?!\.min))*?\.(html|css|js|json)*$/',File::file_get_list($directory,true)) as $file ){
			preg_match('/(.*?)\.(html|css|js|json)$/',$file,$match);

			$minFile = $match[1].'.min.'.$match[2];

			if( !is_file($minFile) || filemtime($file)>filemtime($minFile) ){
				$systemResult = NULL;

				$escFile	= preg_replace( '/ /', '\ ', $file );
				$escMinFile	= preg_replace( '/ /', '\ ', $minFile );

				switch( $match[2] ){
					case 'css':
					case 'js':
						system( "java -jar ".$javaRoot."/yuicompressor.jar -o ".$escMinFile." ".$escFile, $systemResult );
					break;
				#	case 'js':
				#		system("java -jar ".$javaRoot."/closurecompiler.jar --js ".$escFile." --js_output_file ".$escMinFile, $systemResult );
				#	break;
					case 'html':
						system("java -jar ".$javaRoot."/htmlcompressor.jar -o ".$escMinFile." ".$escFile, $systemResult );
					break;
					case 'json':
						File::file_write_contents( $minFile, json_encode(json_decode(File::file_read_contents($file),true)) );
					break;
				}
				if( $systemResult ){
					if( is_file($minFile) )
						unlink($minFile);
					$errors[] = 'Minify: '.$minFile;
				};
			}
		}

		return $errors;
	}
}

?>