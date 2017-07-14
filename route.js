/**@license
 *  route.js - simple router with dependency injection
 *  Copyright (C) 2014-2017 Jakub Jankiewicz <http://jcubic.pl/me>
 *
 *  Released under MIT license
 */
/* global define, exports, module. require */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.route = factory();
    }
}(typeof this == 'undefined' ? window : this, function () {
    // this is where I defined my module implementation
    function route() {
        var name_re = '[a-zA-Z_][a-zA-Z_0-9]*';
        var self = this;
        var open_tag = '{{';
        var close_tag = '}}';
        self.route_parser = function(open, close) {
            function escape_re(str) {
                if (typeof str == 'string') {
                    var special = /([\^\$\[\]\(\)\{\}\+\*\.\|])/g;
                    return str.replace(special, '\\$1');
                }
            }
            var routes = {};
            var tag_re = new RegExp('(' + escape_re(open) + name_re +
                                    escape_re(close) + ')', 'g');
            var clear_re = new RegExp(escape_re(open) + '(' + name_re + ')' +
                                      escape_re(close), 'g');
            return function(str) {
                var result = [];
                str = str.split(tag_re).map(function(chunk) {
                    if (chunk.match(tag_re)) {
                        result.push(chunk.replace(clear_re, '$1'));
                        return '([^\\/]+)';
                    } else {
                        return chunk;
                    }
                }).join('');
                return {re: str, names: result};
            };
        };
        self.extract_names = function(fn) {
            if (typeof fn == 'function') {
                fn = fn.toString();
            }
            fn = fn.replace(/\s*/g, '');
            var m = fn.match(/function[^(]*\(([^\)]*)/);
            if (!m) {
                m = fn.match(/\(([^\)]*)\)\=>/);
            }
            return m[1].split(',');
        };
        var parser = self.route_parser(open_tag, close_tag);
        self.routes = {};
        self.match = function(path, fn, data, injectibles) {
            if (path instanceof Array) {
                path.forEach(function(path) {
                    self.match(path, fn, data, self.extract_names(fn));
                });
            } else {
                var parts = parser(path);
                if (!self.routes[parts.re]) {
                    self.routes[parts.re] = [];
                }
                self.routes[parts.re].push({
                    names: parts.names,
                    callback: fn,
                    data: data,
                    injectibles: injectibles || self.extract_names(fn)
                });
            }
        };
        self.test = function(pattern, url) {
            return !!self.map(pattern, url);
        };
        self.map = function(pattern, url) {
            var parts = parser(pattern);
            var m = url.match(new RegExp('^' + parts.re + '$'));
            if (m) {
                var matched = m.slice(1);
                var result = {};
                if (matched.length) {
                    parts.names.forEach(function(name, i) {
                        result[name] = matched[i];
                    });
                }
                return result;
            }
        };
        self.pick = function(routes, url) {
            var input;
            var keys;
            if (routes instanceof Array) {
                input = {};
                keys = routes;
                routes.map(function(route) {
                    input[route] = route;
                });
            } else {
                keys = Object.keys(routes);
                input = routes;
            }
            var results = [];
            for (var i=keys.length; i--;) {
                var pattern = keys[i];
                var parts = parser(pattern);
                var m = url.match(new RegExp('^' + parts.re + '$'));
                if (m) {
                    var matched = m.slice(1);
                    var data = {};
                    if (matched.length) {
                        parts.names.forEach(function(name, i) {
                            data[name] = matched[i];
                        });
                    }
                    results.push({
                        pattern: pattern,
                        data: data
                    });
                }
            }
            return results;
        };
        self.exec = function(url, init) {
            Object.keys(self.routes).forEach(function(re) {
                var m = url.match(new RegExp('^' + re + '$'));
                if (m) {
                    self.routes[re].forEach(function(obj) {
                        var matched = m.slice(1);
                        var args = [];
                        if (matched.length) {
                            matched.forEach(function(value, i) {
                                var name = obj.names[i];
                                var index = obj.injectibles.indexOf(name);
                                if (-1 != index) {
                                    args[index] = value;
                                }
                            });
                        }
                        if (typeof init == 'function') {
                            init(obj.data, function(context) {
                                obj.callback.apply(context, args);
                            });
                        } else {
                            obj.callback.apply(null, args);
                        }
                    });
                }
            });
        };
    }
    return route;
}));



