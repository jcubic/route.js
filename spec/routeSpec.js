/**@license
 *  route.js - simple router with dependency injection
 *  Copyright (C) 2014-2017 Jakub Jankiewicz <http://jcubic.pl/me>
 *
 *  Released under MIT license
 */
/* global describe, beforeEach, afterEach, it, spyOn, route, expect */


// fake toString from original function so route.js will work
function spy(obj, fun) {
    var orig = obj[fun];
    spyOn(obj, fun).and.callThrough();
    obj[fun].toString = function() {
        return orig.toString();
    };
}

describe('Testing route.js library', function() {
    describe('test', function() {
        var args, controller, router;
        beforeEach(function() {
            controller = {
                foo: function(name, id) {
                    args = [].slice.call(arguments);
                },
                bar: function(name) {
                },
                baz: function() {
                }
            };
            spy(controller, "foo");
            spy(controller, "bar");
            spy(controller, "baz");
            router = new route();
            router.match('/foo/bar/--{{id}}--{{name}}--', controller.foo);
            router.match('/foo/baz/{{id}}--{{name}}', controller.bar);
            router.match('/foo/quux/{{id}}', controller.baz);
            router.match('/', controller.bar);
            router.exec('/foo/bar/--10--hello--');
        });
        it('foo route shuld be called', function() {
            expect(controller.foo).toHaveBeenCalled();
        });
        it('bar route shoud not be called', function() {
            expect(controller.bar).not.toHaveBeenCalled();
        });
        it('baz should not have args', function() {
            router.exec('/foo/quux/10');
            expect(controller.baz.calls.argsFor(0)).toEqual([]);
        });
        it('should get number and name from url', function() {
            expect(args).toEqual(['hello', '10']);
        });
    });
});
