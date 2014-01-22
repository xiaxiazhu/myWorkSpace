/*
 * @author			Emanuel Vitzthum
 * @copyright		© 2012 jQuery SDK v1.4
 * @info			http://www.jquerysdk.com
 *
 * @license			Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.gnu.org/licenses/gpl.html)
 *
 * @plugin			jQuery.class
 */

jQuery.plugin( 'jQuery.class', function( $, undefined ){

	// base class, all classes based on this
	var _Class = function(){};
	$.extend(_Class.prototype,{
		Constructor: function(){
		},
		Proxy: function( fn ){
			return typeof fn === 'string' ? $.proxy( this, fn ) :  $.proxy( fn, this );
		}
	});

		// while initializing a new class
	var initializing = false,

		// inherit from super-class, sets up the Inherited method, and extend the options hash
		inheritProps = function( newPrototype, extPrototype, prototype ){
			for(var name in newPrototype) {
				// Check if we're overwriting an existing function
				prototype[name] =
					$.isFunction(newPrototype[name]) && $.isFunction(extPrototype[name]) && !/^(Constructor|Setup|Proxy|Inherited|Class)$/.test(name) ?
						(function(name, fn){
							return function() {
								var tmp = this.Inherited,
									ret;
								// Add a new Inherited() method that is the same method, but on the super-class
								this.Inherited = function(args){
									return extPrototype[name].apply(this,args||[]);
								};
								// executing method
								ret = fn.apply(this, arguments);
								// The method only need to be bound temporarily, so we, remove it after executing method
								this.Inherited = tmp;
								// return value of method
								return ret;
							};
						})(name, newPrototype[name]) :
						newPrototype[name];
			}

			return prototype;
		},

		classCreator = function( Classname, Extend, Prototype ){

			Prototype = Prototype || {};

			var parts     = Classname.split(/\./),
				fullName  = Classname,
				shortName = parts.pop(),
				namespace = parts.join('.'),

				// All construction is actually done in the init method
				Class     = $.scope( namespace, namespace.match(/^jQueryClass/) ? cache : undefined )[shortName] = function() {
					if(initializing){
						return;
					}
					else{
						return this.Constructor.apply( this, arguments );
					}
				},
				prototype;

			// init instance of Extend as prototype
			initializing = true;
			prototype = new Extend();
			initializing = false;

			// Copy the properties over onto the new prototype
			prototype = inheritProps(Prototype, Extend.prototype, prototype);
			// make sure Class cant'overwritten
			prototype.Class = Class;
			// make sure the inherited Constructor will execute too
			prototype.Constructor = (function(self){
				return function() {
					var args;
					if( $.isFunction(self.Setup) ){
						args = self.Setup.apply( this, arguments );
					}
					if( Extend.prototype.Constructor ){
						Extend.prototype.Constructor.apply( this, arguments);
					}

					return $.isFunction(self.Constructor) ? self.Constructor.apply( this, args || arguments ) : undefined;
				};
			})(Prototype);

			// set things that can't be overwritten
			$.extend(Class,{
				prototype:   prototype,
				inherited:   Extend.prototype,
				constructor: Class,
				fullName:    fullName,
				shortName:   shortName
			});

			return Class;
		},

		// cache classes for multiple extends
		cache = {},

		// count cached classes
		uid = 0;

	$.extend({
		// create a new class
		Class: function( Classname , Extends , Prototype ) {
			if( !Prototype ) {
				return classCreator( Classname , _Class , Extends );
			}
			else if( $.isArray(Extends) ){
				var Extend = Extends.shift();
				var Proto;
				var Name;

				for( var i=0,l=Extends.length ; i<l ; i++ ) {
					Name = 'jQueryClass'+(uid++);
					Proto = Extends.shift().prototype;
					Extend = classCreator( Name, Extend, Proto );
					Extend.fullName = Proto.Class.fullName;
					Extend.shortName = Proto.Class.shortName;
				}

				return classCreator( Classname, Extend, Prototype );
			}
			else {
				return classCreator( Classname , Extends , Prototype );
			}
		},
		// check is object a class, strict sure it was build with $.Class
		isClass: function( obj, strict ){
			return $.isFunction(obj) && !$.isEmptyObject(obj.prototype) && (strict ? !!obj.prototype.Class : true);
		}
	});


});