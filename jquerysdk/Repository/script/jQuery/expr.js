/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.expr
 */

jQuery.plugin( 'jQuery.expr', function( $, undefined ){

	var inputTextareaExp = /^(input|textarea)$/i,
		selectExp = /^select$/i,
		checkedExp = /^(radio|checkbox)$/i,
		onExp = /^(|on)$/i;

	// special selector
	$.extend( $.expr[":"],{
		'changed': function( elem ){
			return inputTextareaExp.test(elem.nodeName) ?
						checkedExp.test(elem.type) ?
							elem.defaultChecked !== elem.checked || (elem.defaultValue !== elem.value && !onExp.test(elem.defaultValue) && !onExp.test(elem.value) ) :
							elem.defaultValue !== elem.value :
						selectExp.test(elem.nodeName) ?
							!(elem.options[ elem.selectedIndex ] || {}).defaultSelected :
							false;
		},
		'readonly': function( elem ){
			return !!elem[ $.propFix.readonly ];
		}
	});

});