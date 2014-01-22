/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.event.special.dom
 */

jQuery.plugin( 'jQuery.event.special.dom', function( $, undefined ){

	var getId = function( node, obj ){
			return ( node[ $.expando ] || (node[ $.expando ] = ++$.guid) )+'.'+( obj.guid || (obj.guid = ++$.guid) );
		},

		emhelper = {

		},

		handleCount = 0,

		handleStack = {
			em:		{},
			view:	{}
		},

		handleRegister = function( node, handle, type ){
			handleStack[ type==='emchange' ? 'em' : 'view' ][ getId(node,handle) ] = { elem:$(node), type:handle.type };

			handleControl( 1 );
		},

		handleDelete = function( node, handle, type ){
			var id = getId(node,handle);

			delete( handleStack[ type==='emchange' ? 'em' : 'view' ][ id ] );

			handleControl( -1 );
		},

		handleControl = function( i ){
			handleCount += i;

			if( handleCount<=0 ){
				clearInterval(handleInterval);
				handleInterval = 0;
			}
			else if( !handleInterval ){
				handleInterval = setInterval(function(){

					// show, hide, toggle, resize
					$.each( handleStack.view, function(){
							// alias of this
						var self = this,
							// element
							elem = self.elem,
							// type
							type = self.type,
							// get old state
							before = self.now,
							// get/set new state
							now = self.now = type === 'resize' ? [ elem.width(), elem.height(), elem.prop('scrollWidth'), elem.prop('scrollHeight')  ] : !elem.is(':visible');
						// set old state
						before = self.before = before===undefined ? now : before;

						if(
							(type=='hide' && now && !before) ||
							(type=='show' && !now && before) ||
							(type=='toggle' && now !== before) ||
							(type=='resize' && (now[0] !== before[0] || now[1] !== before[1] || now[2] !== before[2] || now[3] !== before[3]))
						) elem.trigger(type);

					});

					// emchange
					if( emhelper.node ){
						var now		= emhelper.node.offsetWidth/100,
							before	= emhelper.before || now;

						if( (emhelper.before = now) != before ){

							var event = {
									type: 'emchange',
									emSize: now,
									emDelta: now - before
								};

							$.each( handleStack.em, function(){
								this.elem.trigger(event)
							});
						}
					}
				},25);
			}
		},

		handleInterval;

	// show, hide, toggle, resize, emchange
	$.each(['show', 'hide', 'toggle', 'resize', 'emchange'], function( i, name ) {
		$.event.special[ name ] = {
			add: function( bind ) {
				if( name==='resize' && this.onresize!==undefined )
					return;

				handleRegister( this, bind, name );
			},
			remove: function( unbind ) {
				if( name==='resize' && this.onresize!==undefined )
					return;

				handleDelete( this, unbind, name );
			}
		};
	});
	// build check node for emchange
	$.ready(function(){
		emhelper.node = $('<div />').css({left:'-100em',position:'absolute',width:'100em'}).prependTo('body')[0];
	});

});