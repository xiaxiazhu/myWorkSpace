KISSY.add(function (S, Base) {
    describe('rich-base', function () {
        it('support initializer and destructor', function () {
            var initializerCalled = 0,
                destructorCalled = 0;

            var T = Base.extend({
                initializer: function () {
                    initializerCalled++;
                },
                destructor: function () {
                    destructorCalled++;
                }
            }, {
                name: 'TestTT'
            });

            expect(T.toString().indexOf('TestTT')).not.toBe(-1);
            var t = new T();

            expect(initializerCalled).toBe(1);

            t.destroy();

            expect(destructorCalled).toBe(1);
        });

        it('support extension', function () {

            var initializer = [],
                destructor = [];

            function Ext1() {
                initializer.push(1);
            }

            Ext1.prototype = {
                constructor: Ext1,
                __destructor: function () {
                    destructor.push(1);
                }

            };

            function Ext2() {
                initializer.push(2);
            }

            Ext2.prototype = {
                constructor: Ext2,
                __destructor: function () {
                    destructor.push(2);
                }
            };

            var T = Base.extend([Ext1, Ext2], {
                initializer: function () {
                    initializer.push(3);
                },

                destructor: function () {
                    destructor.push(3);
                }
            });

            var t = new T();

            expect(initializer).toEqual([1, 2, 3]);

            t.destroy();

            expect(destructor).toEqual([3, 2, 1]);

        });

        it('support plugin config', function () {

            var initializer = [],
                destructor = [];

            function Plugin1() {

            }

            Plugin1.prototype = {

                constructor: Plugin1,

                pluginInitializer: function () {
                    initializer.push(1);
                },

                pluginDestructor: function () {
                    destructor.push(1);
                }

            };


            function Plugin2() {

            }

            Plugin2.prototype = {

                constructor: Plugin2,

                pluginInitializer: function () {
                    initializer.push(2);
                },

                pluginDestructor: function () {
                    destructor.push(2);
                }

            };

            var T = Base.extend({
                initializer: function () {
                    initializer.push(3);
                },
                destructor: function () {
                    destructor.push(3);
                }
            });

            var t = new T({
                plugins: [Plugin1, new Plugin2()]
            });

            expect(t.get('plugins').length).toBe(2);

            expect(initializer).toEqual([3, 1, 2]);

            t.destroy();

            expect(destructor).toEqual([1, 2, 3]);

        });


        it('support plug unplug', function () {

            var initializer = [],
                destructor = [];

            function Plugin1() {

            }

            Plugin1.prototype = {

                pluginId: 'plugin1',

                constructor: Plugin1,

                pluginInitializer: function (tt) {
                    expect(tt.isT).toBe(1);
                    initializer.push(1);
                },

                pluginDestructor: function (tt) {
                    expect(tt.isT).toBe(1);
                    destructor.push(1);
                }

            };


            function Plugin2() {

            }

            Plugin2.prototype = {

                constructor: Plugin2,

                pluginInitializer: function (tt) {
                    expect(tt.isT).toBe(1);
                    initializer.push(2);
                },

                pluginDestructor: function (tt) {
                    expect(tt.isT).toBe(1);
                    destructor.push(2);
                }

            };

            var T = Base.extend({
                isT: 1,
                initializer: function () {
                    initializer.push(3);
                },
                destructor: function () {
                    destructor.push(3);
                }
            });

            var t = new T();

            expect(initializer).toEqual([3]);

            expect(t.get('plugins').length).toBe(0);

            t.plug(Plugin1);

            expect(t.get('plugins').length).toBe(1);

            expect(initializer).toEqual([3, 1]);

            var p2;

            t.plug(p2 = new Plugin2());

            expect(t.get('plugins').length).toBe(2);

            expect(initializer).toEqual([3, 1, 2]);

            t.unplug(p2);

            expect(t.get('plugins').length).toBe(1);


            expect(destructor).toEqual([2]);

            t.unplug('plugin1');

            expect(t.get('plugins').length).toBe(0);

            expect(destructor).toEqual([2, 1]);

            t.destroy();

            expect(destructor).toEqual([2, 1, 3]);

        });

        it('support unplug all', function () {

            var initializer = [],
                destructor = [];

            function Plugin1() {

            }

            Plugin1.prototype = {

                constructor: Plugin1,

                pluginInitializer: function () {
                    initializer.push(1);
                },

                pluginDestructor: function () {
                    destructor.push(1);
                }

            };


            function Plugin2() {

            }

            Plugin2.prototype = {

                constructor: Plugin2,

                pluginInitializer: function () {
                    initializer.push(2);
                },

                pluginDestructor: function () {
                    destructor.push(2);
                }

            };

            var T = Base.extend({
                initializer: function () {
                    initializer.push(3);
                },
                destructor: function () {
                    destructor.push(3);
                }
            });

            var t = new T({
                plugins: [Plugin1, new Plugin2()]
            });

            t.unplug();

            expect(t.get('plugins').length).toBe(0);

            expect(destructor).toEqual([1, 2]);

        });

        it('support attr bind', function () {

            var xx = [];

            var T = Base.extend({
                '_onSetXx': function (v) {
                    xx.push(v);
                }
            }, {
                ATTRS: {
                    xx: {}
                }
            });

            var t = new T({
                xx: 1
            });

            expect(xx).toEqual([1]);

            t.set('xx', 2);

            expect(xx).toEqual([1, 2]);


        });

        it('support callSuper', function () {
            var A = Base.extend({
                m: function (value) {
                    return 'a' + value;
                },
                m2: function (value) {
                    return 'a' + value;
                }
            });

            var B = A.extend({
                m2: function (value) {
                    return 'b' + this.callSuper(value);
                },
                m: function (value) {
                    var superFn = S.bind(this.callSuper, arguments.callee, this);

                    // 普通的
                    var t0 = this.callSuper(value);

                    // 闭包情况下通过 caller 获取 callSuper
                    var t1 = '';
                    (function () {
                        (function () {
                            (function () {
                                t1 = superFn(1);
                            })();
                        })();
                    })();

                    // 递归情况下通过提前绑定 arguments.callee 获取 callSuper
                    var times = 0;
                    var t2 = '';
                    (function t() {
                        if (times++ >= 2) return;
                        t2 += superFn(2);
                        t();
                    })();

                    return t0 + t1 + t2 + 'b' + value;
                }
            });

            var C = B.extend({
                m2: function () {
                    return 'c' + this.callSuper.apply(this, arguments);
                }
            });

            var c = new C();
            expect(c.m(0)).toEqual('a0a1a2a2b0');
            expect(c.m2(0)).toBe('cba0');
        });

        it('support shared proto', function () {
            var x = {
                x: function () {
                    return this.callSuper();
                }
            };

            var X = Base.extend({
                x: function () {
                    return 'x'
                }
            }, {
                name: 'X'
            });

            var Y = X.extend(x, {
                name: 'Y'
            });

            var Z = Base.extend({
                x: function () {
                    return 'z'
                }
            }, {
                name: 'Z'
            });

            var Y2 = Z.extend(x, {
                name: 'Y2'
            });

            expect(new Y().x()).toBe('x');
            expect(new Y2().x()).toBe('z');
        });


        it('_onSet will run by order', function () {
            var order = [];
            var X = Base.extend({
                _onSetX: function () {
                    order.push(1);
                },
                '_onSetZ': function () {
                    order.push(2);
                }
            }, {
                ATTRS: {
                    x: {
                        value: 2
                    },
                    z: {
                        value: 2
                    }
                }
            });

            var Y = X.extend({
                _onSetY: function () {
                    order.push(33);
                },
                _onSetX: function () {
                    order.push(11);
                }
            }, {
                ATTRS: {
                    y: {
                        value: 1
                    }
                }
            });

            new Y();

            expect(order).toEqual([11, 2, 33]);
        });

        it('support inheritedStatics', function () {
            var t = {};
            var X = Base.extend({}, {
                inheritedStatics: {
                    z: t
                }
            });
            var Z = X.extend();
            expect(X.z).toBe(t);
            expect(Z.z).toBe(t);
        });
    });

}, {
    requires: ['base']
});