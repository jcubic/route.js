## route.js

[![npm](https://img.shields.io/badge/npm-0.5.0-blue.svg)](https://www.npmjs.com/package/jroute.js)
![bower](https://img.shields.io/badge/bower-0.5.0-yellow.svg)

Very small and simple routing library that can be use on the server or in the
browser. It use dependency injection to inject arguments to your function.

It contain only a router so it can be use anywhere. It's only the API so you
need to write your own code that will execute when ever you want (like on
hashchange or using HTML5 History API).


## Install

You can grab the file from repo or from npm:

```
npm install jroute.js
```

or from bower

```
bower install route.js
```

and inlcude the route.js and you're good to go.


## Usage

```javascript
var router = new route();

// from version 0.4.0 you can use arrow functions

router.match('/foo/bar/{{id}}/{{name}}', function(name, id) {
    // name and id will be in different order
    // names in url need to match names in function
    console.log(name + ' ' + id);
});

router.exec(location.hash.replace(/^#/, ''));
```

if you want to execute on change of the hash so hyperlinks work you can use this code:

```javascript
window.addEventListener('hashchange', function() {
    router.exec(location.hash.replace(/^#/, ''));
});
```

the init exec will also be needed to get init route when you refresh the page

## API

* `router::route_parser(open tag, close tag)`: return parser function that need to be called with route
  the function return object `{re: sting: names: array}`, if you want regex object you need to use
  new RegExp('^' + re + '$') to have exact match, name filed contain list of names extracted from route
  (between open and closing tag).

* `router::extract_names(fn)`: return parameters names from the function (from version 0.4.0 it work with arrow functions).

* `router::test(route, path)`: first argument is route that cane be parsed and second is actual path, it return true if path match the route.

* `router::match(path, fn[, data])`: create route, first is parsable route path as string, second is a function that will be called when exec is executed and thrid is optional data that will be stored in route, you will be able to access it in `router::exec` if you use a function as second argument.

* `router::exec(url[, init])`: method execute route added by `router::match` if found any. The init paramater is a function (optioanl) that allow to execute match function with different context. The function is called with two arguments: (data from match function and callback function that need to be called with different context).

* `router::map(pattern, url)`: return object with mapping names taken from url, eg. if you call it with:
```javascript
router.map('/user/{{name}}', '/user/foo');
```
it will return `{name: "foo"}` if pattern don't have variables it will return empty object and if it don't match it will return undefined.


## License

Licensed under [MIT](http://opensource.org/licenses/MIT) license

Copyright (c) 2014-2017 [Jakub Jankiewicz](http://jcubic.pl/me)
