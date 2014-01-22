/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.fn.form
 */

jQuery.plugin( 'jQuery.fn.form', 'jQuery.expr', function( $, undefined ){

	var _form = document.createElement('form');

	$.fn.extend({
		// find all associated inputs to the first matched (default selector ":radio")
		formGroup: function( selector ){
			var elem = this.filter( (selector = selector || ':radio') + ':first' )[0] || {},
				name = elem.name,
				form = elem.form,
				owner = elem.ownerDocument,
				elems = [];

			if( name && (form || owner) ){
				$.each( selector = selector.split(','), function( i, sel ){
					selector[i] = $.trim(sel) + "[name='" + name + "']";
				});
				selector = selector.join(',');

				elems = (
						form ?
							$(form).formInput().filter(selector) : 
							$( ':input', owner ).filter(selector).filter(function(){ return !this.form })
					)
					.get();
			}

			return this.pushStack( elems );
		},
		// find all inputs of the the first matched form
		formInput: function(){
			return this.pushStack( (this.filter('form:first')[0] || {}).elements || [] );
		},
		// reset all selected forms or formInputs
		formReset: function(){
			var stack = [],
				form = this
					.filter('form:first'),
				elems = this
					.filter(':input')
					.each(function(){
						var elem = $(this),
							spacer = elem
								.clone()
								.insertAfter(elem);

						_form.appendChild(this);
						stack.push( [ elem, spacer ] );
					});

			// first match form
			if( form.length ){
				form[0].reset();
				form.triggerHandler('reset');
			}

			// matched elements
			_form.reset();

			$.each( stack, function( i, data ){
				var elem = data[0],
					spacer = data[1];

				elem
					.insertBefore(spacer)
					.triggerHandler('reset');
				spacer.remove();
			});

			return this;
		},
		// clear all selected forms or formInputs
		formClear: function(){
			var inputs = $(this);
			
			inputs.push.apply( inputs, inputs.formInput().get()  );
			
			inputs.filter(':file').formReset();
			inputs.filter(':checked').removeProp('checked');
			inputs.not('select,:radio,:checkbox').val('');
			inputs.find('select').prop('selectedIndex',-1);
			inputs.find('option:selected').removeProp('selected');
			
			return this;
		}
	});

});