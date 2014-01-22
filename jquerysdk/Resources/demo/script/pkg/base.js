/*
 * @author			AUTHOR
 * @copyright		© 2011 COMPANY
 * @info			URL
 *
 * @license			LICENCE
 *
 * @packege			pkg.base
 */




/*!CONFIG({
	"depend": {
		"pluginRoot": "script"
	}
})*/

jQueryConfig = {
	depend: {
		pluginRoot: 'script'
	}
};




/*!PKG({
	"plugin":	["jQuery.core"]
})*/

jQuery.plugin(
	'pkg.base',
	{
		plugin: ['jQuery.core']
	},
	function( $, undefined ){



	});