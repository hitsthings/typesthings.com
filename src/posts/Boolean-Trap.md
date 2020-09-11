---
title: Escaping the Boolean Trap in JS
id: 0cac86a9e9f65a843883b0db7dfa4122
date: 2013-01-20T21:12:59.185Z
editDate: 2013-01-20T21:30:45.357Z
originalURL: http://www.noiregrets.com/blog/2013/01/20/0cac86a9/Escaping-the-Boolean-Trap-in-JS
published: true
tags:
  - API
  - JS tips
---

The Boolean Trap refers to a common mistake when writing APIs in which you use booleans as input parameters and the code becomes unreadable.

NodeJS has an example in [url.parse](http://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost)

```js
url.parse('example.com', true, false);
```

Here's an example that [jQuery is looking to solve](http://bugs.jquery.com/ticket/13103).

```js
$('.thing').animate(...).stop(true, false);
```

What the hell does `.stop(true, false)` mean?!

Usually as caller of this API you're stuck with either the above unreadable code, or you add some extra variables in that clarify the purpose of the boolean. Something like:

```js
var clearQueue = true, jumpToEnd = false;
$('.thing').stop(clearQueue, jumpToEnd);
```

But sometimes there are advantages to dynamic typing. In JS, I'm a fan of

```js
$('.thing').stop('clearQueue', !'jumpToEnd');
```

Or in the Node case

```js
url.parse('example.com', 'parseQuery', !'slashesDenoteHost');
```

The purpose of the parameter is clear and the value of the parameter is clear. You can clarify the type by wrapping the params with `Boolean('clearQueue')` or similar if it makes you feel better.

## Further reading:

* [hall of api shame: boolean trap](https://web.archive.org/web/20160807202936/http://ariya.ofilabs.com/2011/08/hall-of-api-shame-boolean-trap.html)
* [Detecting Boolean Traps with Esprima](http://ariya.ofilabs.com/2012/06/detecting-boolean-traps-with-esprima.html)
