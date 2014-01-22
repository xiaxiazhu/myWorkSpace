/*
 * @author          Emanuel Vitzthum
 * @copyright       © 2012 jQuery SDK v1.4
 * @info            http://www.jquerysdk.com
 *
 * @license         Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @based			jQuery UI Widget (http://docs.jquery.com/UI/Widget) license (http://jquery.org/license)
 *
 * @plugin			jQuery.ui.widget
 */

jQuery.plugin( 'jQuery.ui.widget', ['jQuery.class', 'jQuery.each'], function( $, undefined ){


var _cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base , prototype ) {
	var part		= name.split( "." ),
		namespace	= part.shift(),
		subclass	= "jQuery",
		classname	= subclass+'.'+name,
		fullName	= "",
		data		= "";
	
	if( part.length >= 2 ){
		subclass	= namespace;
		classname	= name;
		namespace	= part.shift();
		
		if( subclass!=="jQuery" ){
			fullName = subclass + "-";
			data = subclass + "-";
		}
	}

	name = $.camelCase( part.join('-') );
	fullName += namespace + "-" + name;
	data += name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, data );
	};

	var object = $.Class( classname, base, prototype );
	$.extend( object.prototype, {
		namespace: namespace,
		widgetData: data,
		widgetName: name,
		widgetEventPrefix: object.prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	});

	$.widget.bridge( name, object, subclass );
};

$.widget.bridge = function( name, object, subclass ){

	window[ subclass ].fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this,
			data = object.prototype.widgetData;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && /^[A-Z_]/.test(options) && options!='Instance' ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, data ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
				if( options==='Instance' ){
					returnValue = instance;
					return false;
				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each( true, function() {
				var instance = $.data( this, data );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					var instance = new object( options, this );
					$.data( this, data, instance );
					return instance.element[0];
				}
			});
		}

		return returnValue;
	};
};

$.Class( 'jQuery.Widget', {

	widgetName: "widget",
	widgetEventPrefix: "",

	options: {
		disabled: false
	},

	Constructor: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetData, this );
		this.element = $( element );

		// recursive inherited options extend
		var o = [ this.options, this._getCreateOptions(), options ],
			inh = this.Class.inherited,
			cur;
		while( inh ){
			cur = inh;
			inh = (cur.Class||{}).inherited;
			o.unshift( cur.options )
		}
		o.unshift({});
		o.unshift(true);

		this.options = $.extend.apply( $, o );

		var self = this;
		this.element.on( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.off( "." + this.widgetName )
			.removeData( this.widgetData );
		this.widget()
			.off( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
});

});
