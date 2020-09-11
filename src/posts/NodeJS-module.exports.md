---
title: "NodeJS - module.exports vs exports"
id: e40baf63cbf7cc36ee6d53934e74cc30
date: 2013-10-19T01:51:21.103Z
editDate: 2013-10-20T02:30:12.829Z
originalURL: http://www.noiregrets.com/blog/2013/10/19/e40baf63/NodeJS-module-exports-vs-exports
published: true
tags:
  - NodeJS
  - JS tips
---

I read [an article](http://www.hacksparrow.com/node-js-exports-vs-module-exports.html) on the difference between `module.exports` and `exports` in NodeJS and thought I could contribute to the discussion.

The key difference between the two is that `module.exports` is what matters, and `exports` just happens to point to the same thing.

It might help clarify things to show how the two variables are initialized. Essentially before your code runs, there is code that runs like this:

    var module = {…}; // other module stuff
    var exports = module.exports = {};

So both variables initially point to the same empty Object, but of course can be reassigned to any other value instead. If you reassign the `exports` variable, it doesn’t affect `module.exports`. Similarly, if you reassign `module.exports`, it no longer affects `exports`. They will be pointing at different values.

It's important to note the distinction between _variables_ and _values_. `module.exports` and `exports` are just _variables_ that start out pointing to the same _value_. If you modify the value they both point to, for example if that value is an object and you set properties on it, then both of those variables are both affected. But if you point one of those variables at a _different_ value, then modifying the value of one will no longer change the other.

What makes `module.exports` the “real deal” is that when someone `require()`s your module, `require` executes something like this:

```js
function require(moduleName) {
    var module = getModule(moduleName);
    return module.exports;
}
```

`require` grabs the module and finds the exports property of it. So the values that matter are first whatever value `module` points to, and then whatever value the `exports` property on it points to.

It might also help to say that `module` is the real deal, not that `module.exports` is. Take this code for example:

```js
var truth = module;
var notExports = module.exports;

truth.exports = { genre: "Rock" };
notExports.genre = "Blues";
```

`Rock` will be exported. Since `truth` is pointing to `module`, it can make lasting changes to the exports that `notExports` can’t. As soon as `truth` changes the value of `module`'s `exports` property, the old value that `notExports` still points to is moot.