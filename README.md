## route.js

Very small and simple routing library that can be use on the server or in the
browser. It use dependency injection to inject arguments to your function.

It contain only a router so it can be use anywhere. It's only the API so you
need to write your own code that will execute when ever you want (like on
hashchange or using HTML5 History API).

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

## License

Copyright (C) 2014 Jakub Jankiewicz &lt;<http://jcubic.pl>&gt;<br/>
License GPLv3+: GNU GPL version 3 or later &lt;<http://gnu.org/licenses/gpl.html>&gt;


This is free software; you are free to change and redistribute it.<br/>
There is NO WARRANTY, to the extent permitted by law.

