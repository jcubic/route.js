## route.js

[![npm](https://img.shields.io/badge/npm-0.3.0-blue.svg)](https://www.npmjs.com/package/jroute.js)
![bower](https://img.shields.io/badge/bower-0.3.0-yellow.svg)

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

router.match('/foo/bar/{{id}}/{{name}}', function(name, id) {
    // name and id will be in different order
    // names in url need to match names in function
    console.log(name + ' ' + id);
});

router.exec(location.hash.replace(/^#/, ''));
```

if you want to execute on change of the hash so hyperlinks work you can use this code:

```
window.addEventListener('hashchange', function() {
    router.exec(location.hash.replace(/^#/, ''));
});
```

the init exec will also be needed to get init route when you refresh the page

## License

Licensed under [MIT](http://opensource.org/licenses/MIT) license

Copyright (c) 2017 [Jakub Jankiewicz](http://jcubic.pl/me)
