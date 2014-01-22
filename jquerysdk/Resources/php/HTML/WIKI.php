<?php
namespace HTML;

use String 				as String;

class WIKI {

	private static $types;

	public static function wiki2html( $text, $type='default' ) {

		$exp = self::$types[ $type ] ? self::$types[ $type ] : self::$types['default'];

		$text = $exp['tags'] ? $text : htmlspecialchars($text);
		foreach( $exp['search'] as $i=>$regexp ){
			$replace = $exp['replace'][$i];
			$text = is_callable($replace) ? preg_replace_callback($regexp,$replace,$text) : preg_replace($regexp,$replace,$text);
		}
		return $text;
	}

	public static function init(){
		self::$types = array(
			// Default Tags allowed
			'default'	=> array(
				'tags'		=> true,
				'search'	=> array (
					'/\r\n/m',  																				#   1
					'/\r/m',																					#   2
					'/\[(http:\/\/.+.(jpg|gif|png))[ ]?([^|]*?)?([|]?([0-9]+)?[x]?([0-9]+)?)?\]/',   			#  19  +  image
					'/\[((http|ftp).?:\/\/.+) ([^]]*?)\]/U',													#   3  +  link and title
					'/^((http|ftp).?:\/\/[^ ]+$)/', 															#   4  +  link
					'/\*([A-z]+(.*))\*/Um', 																	#   5  +  bold
					'/_(.*)_/Um',   																			#   6  +  italic
					'/\^(.*)\^script/Um',   																	#   7  +  sup
					'/,,(.*),,script/Um',   																	#   8  +  sub
					'/~~(.*)~~/Um', 																			#   9  +  strike
					'/`(.*)`/Um',   																			#  10  +  tt
					'/^----/Um',																				#  11  +  hr
					'/(^|\|)======(.*)======$/Um',  															#  12  +  h6
					'/(^|\|)=====(.*)=====$/Um',																#  13  +  h5
					'/(^|\|)====(.*)====$/Um',  																#  14  +  h4
					'/(^|\|)===(.*)===$/Um',																	#  15  +  h3
					'/(^|\|)==(.*)==$/Um',  																	#  16  +  h2
					'/(^|\|)=(.*)=$/Um',																		#  17  +  h1
					'/(^|\|)([ ]{1,4}\*[ ])(.*)$/Um',   														#  18  +  list
					'/(^|\|)([ ]{1,6}\#[ ])(.*)$/Um',   														#  19  +  numeric list
					'/(<\/ol>\n<ol>|<\/ul>\n<ul>)/',															#  20  -  tag reformatter
					'#(</h[123456]>|</table>|</ul>|</ol>)\n#',  												#  21  -  tag reformatter
					'#\n(<ol>|<ul>)#',  																		#  22  -  tag reformatter
					//'/^ ([^<>`= ].*?)/Um',  																	#  23
					'/<\/blockquote>\n<blockquote>/Um', 														#  24  -  tag reformatter
				),
				'replace'	=> array(
					"\n",   																					#   1
					"\n",   																					#   2
					"self::default_image",  																	#  19
					'<a href="$1" title="$3">$3</a>',   														#   3
					'<a href="$1">$1</a>',  																	#   4
					'<strong>\1</strong>',  																	#   5
					'<em>$1</em>',  																			#   6
					'<sup>$1</sup>',																			#   7
					'<sub>$1</sub>',																			#   8
					'<strike>$1</strike>',  																	#   9
					'<tt>$1</tt>',  																			#  10
					'<hr />',   																				#  11
					'<h6>$2</h6>',  																			#  12
					'<h5>$2</h5>',  																			#  13
					'<h4>$2</h4>',  																			#  14
					'<h3>$2</h3>',  																			#  15
					'<h2>$2</h2>',  																			#  16
					'<h1>$2</h1>',  																			#  17
					'$1<ul><li>$3</li></ul>',   																#  18
					'$1<ol><li>$3</li></ol>',   																#  19
					'', 																						#  20
					'$1',   																					#  21
					'$1',   																					#  22
					//'<blockquote>$1</blockquote>',  															#  23
					'', 																						#  24
				)
			),
			// QDoc Tags not allowed
			'QDoc'	=> array(
				'tags'		=> false,
				'search'	=> array(
					'/\r?\n/s',																					#   1  -  break normalize
					'/(?:\[\[([^\|]+?)\]\])/',																	#   2  +  link				(internal)
					'/(?:\[\[([^\|]+?)\|(.+?)\]\])/',															#   2. +  link, title		(internal)
					'/\[((?:http|ftp)s?:\/\/[^ ]+)\]/U',		 												#   3. +  link				(external)
					'/\[((?:http|ftp)s?:\/\/[^ ]+) ([^]]*?)\]/U',												#   3  +  link, title		(external)
					'/\'\'\'([A-z]+(.*))\'\'\'/U',																#   4  +  bold
					'/\'\'([A-z]+.*)\'\'/U',																	#   5  +  italic
					'/&lt;&lt;(.*)&gt;&gt;/U',																	#   6  +  code
					'/--([^-].*)--/U',																			#   7  +  strike
					'/\^\^([^^].*)\^\^/U',																		#   8  +  sup
					'/__([^_].*)__/U',																			#   9  +  sub
					'/^[ ](.*)/m',																				#  10  +  pre
					'/^----/m',																					#  11  +  hr
					'/(^|\|)======\s*(.*)\s*======$/Um',														#  12  +  h6
					'/(^|\|)=====\s*(.*)\s*=====$/Um',															#  13  +  h5
					'/(^|\|)====\s*(.*)\s*====$/Um',															#  14  +  h4
					'/(^|\|)===\s*(.*)\s*===$/Um',																#  15  +  h3
					'/(^|\|)==\s*(.*)\s*==$/Um',																#  16  +  h2
					'/(^|\|)=\s*(.*)\s*=$/Um',																	#  17  +  h1
					'/(^|\|)(\*{1,4}[ ])(.*)$/Um',																#  18  +  list
					'/(^|\|)(\#{1,6}[ ])(.*)$/Um',																#  19  +  numeric list
					'/<\/ul>\n<ul>/s',																			#  20  -  list
					'/<\/ol>\n<ol>/s',																			#  21  -  numeric list
				#	'/^([^<\n].*)$/Um',																			#  22  +  p
					'/^((?!\n|<(?:h1|h2|h4|h4|h5|h6|ul|ol|li|pre|hr|div)).*)$/Um',								#  22  +  p
					'/<\/p>\n<p>/s',																			#  23  -  p
					'/<\/pre>\n<pre>/s',																		#  24  -  pre
				),
				'replace'	=> array(
					"\n",																						#   1
					"self::QDoc_InternalLink",   																#   2
					"self::QDoc_InternalLink",   																#   2.
					'<a href="$1" class="external">$1</a>',  													#   3
					'<a href="$1" class="external" title="$2">$2</a>',  										#   3.
					'<strong>$1</strong>',																		#   4
					'<em>$1</em>',																				#   5
					'<code>$1</code>',																			#   6
					'<strike>$1</strike>',																		#   7
					'<sup>$1</sup>',																			#   8
					'<sub>$1</sub>',																			#   9
					'<pre>$1</pre>',																			#  10
					'<hr />',																					#  11
					'<h6>$2</h6>',																				#  12
					'<h5>$2</h5>',																				#  13
					'<h4>$2</h4>',																				#  14
					'<h3>$2</h3>',																				#  15
					'<h2>$2</h2>',																				#  16
					'<h1>$2</h1>',																				#  17
					'$1<ul><li>$3</li></ul>',																	#  18
					'$1<ol><li>$3</li></ol>',																	#  19
					"\n",																						#  20
					"\n",																						#  21
					'<p>$1</p>',																				#  22
					"\n",																						#  23
					"\n",																						#  24
				)
			)
		);

	}
	// Images of default WIKI markup
	private static function default_image( $args ){
		$url	= $args[1];
		$alt	= $args[3] || 'image';
		$width	= $args[5] || 0;
		$height	= $args[6] || 0;

		return '<a href="'.$url.'"><img src="'.$url.'" alt="'.$alt.'" '.($width?'width="'.$width.'"':'').' '.($height?'height="'.$height.'"':'').'/></a>';
	}
	// Internal links of QDox WIKI markup
	private static function QDoc_InternalLink( $args ){
		$split	= split(':',$args[1]);
		switch( $split[0] ){
			/*
			 * @type			Link to API category
			 *
			 * @example			[[category:Core]]
			 *					[[category:Deferred Object]]
			 *					[[category:Deferred Object|see Deferred Object also]]
			 */
			case 'category':
				array_shift($split);

				$name	= htmlspecialchars(join(':',$split));
				$url	= 'category/'.preg_replace('/\s+/','-',strtolower($name));
			break;
			/*
			 * @type			Link to API entry
			 *
			 * @example			[[api:method:jQuery()]]
			 *					[[api:method:jQuery()|$()]]
			 *					[[api:selector:input|:input]]
			 */
			case 'api':
				array_shift($split);
				$type	= array_shift($split);
				$name	= join(':',$split);
				// trim sub class
				if( preg_match( '/^([A-Za-z0-9]+)[\t ]+>[\t ]+(.*)/', $name, $match ) ){
					$sub = ' sub="'.$match[1].'"';
					$name = htmlspecialchars($match[2]);
				}
				else{
					$name = htmlspecialchars($name);
				}
				// entry types
				$url = 'api/'.String::strtominus( strtolower($type.'-'.$name) );
				switch( $type ){
					case 'method':
						$url = 'api/'.preg_replace('/^(?:\.?)(.*?)(?:\(\))$/','$1',$name);
					break;
					case 'property':
						$url = 'api/'.preg_replace('/^\.?(.*)/','$1',$name);
					break;
					case 'selector':
						$url = 'api/'.$name.'-selector';
					break;
					case 'selector':
						$name = $name.' Selector';
					break;
					case 'style':
						$name = '\''.$name.'\' Style Property';
					break;
					case 'event':
						$name = '\''.$name.'\' Special Event';
					break;
					case 'config':
						$name = $name.' Configuration';
					break;
					case 'template-tag':
						$name = $name=='equal' ? '${} Template Tag' : '{{'.$name.'}} Template Tag';
					break;
					default:
						$name = $call;
					break;
				}
			break;
			/*
			 * @type			WIKI thumb image with link
			 *
			 * @example			[[Image:My File.jpeg|center|200px|alt=An alternative text|My short caption]]
			 *					[[Image:My File.jpeg|center|alt=An alternative text|My short caption]]
			 *					[[Image:My File.jpeg|right|120px|90px|My short caption]]
			 *					[[Image:My File.jpeg|120px|My short caption]]
			 */
			case 'Image':
				array_shift($split);
				$args		= split('\|', $args[2] ? $args[2] : ' ');
				$expr		= array(
					'/^(right|left|center|none)$/',			// location
					'/^([0-9]+px)$/',						// width
					'/^([0-9]+px)$/',						// height
					'/^alt=(.*)$/',							// alt
					'/^(.*)$/'								// caption
				);

				$options	= array( 'none', '', '', 'image', '' );
				$url		= htmlspecialchars(join(':',$split));
				// imeges directory prefix if url not absolute
				if( !preg_match('/^(http|ftp)s?:\/\//',$url) )
					$url	= 'images/'.$url;
				// merge options with default
				for( $i=0, $j=0 ; $i<sizeof($args) && $expr[$j] ; $i++, $j++ ){
					if( preg_match( $expr[$j], $args[$i]) )
						$options[$j] = htmlspecialchars( preg_replace($expr[$j],'$1',$args[$i]) );
					else
						$i--;
				}
				// return thumb image structure
				return '<div class="thumb t'.$options[0].'"><div class="thumbinner"><a href="'.$url.'" class="image"><img src="'.$url.'" class="thumbimage" alt="'.$options[3].'" style="'.($options[1] ? 'width:'.$options[1].';' : '').($options[2] ? 'height:'.$options[2].';' : '').'"/></a>'.($options[4] ? '<div class="thumbcaption">'.$options[4].'</div>' : '').'</div></div>';
			break;
			/*
			 * @type			Normal internal WIKI link
			 *
			 * @example			[[Main Page]]
			 *					[[Category:Example]]
			 */
			default:
				$name	= htmlspecialchars(join(':',$split));
				$url	= 'wiki/index.php?title='.preg_replace('/ /','_',$name);
			break;
		}

		// default link return
		if( defined($args[2]) ){
			$title = htmlspecialchars($args[2]);
			return '<a href="'.$url.'" title="'.$title.'">'.$title.'</a>';
		}
		else{
			return '<a href="'.$url.'">'.$name.'</a>';
		}
	}
}

WIKI::init();
?>