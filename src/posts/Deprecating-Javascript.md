---
title: Deprecating Javascript
id: 9be8eb4d51fffc3a67431caf7187c0d8
date: 2013-03-25T11:17:13.460Z
editDate: 2013-03-25T11:17:13.460Z
originalURL: http://www.noiregrets.com/blog/2013/03/25/9be8eb4d/Deprecating-Javascript
published: true
tags:
  - API
  - JS tips
---

At work I've been doing some work related to exposing and supporting a Javascript API in our app ([Stash](https://wwww.atlassian.com/stash)). The idea is that plugin developers could use the functions and data in our API when implementing their plugins.

It's be pretty interesting so far, and it doesn't seem like there is a lot of prior art out there for deprecating JS APIs. There are a lot of questionsto be asked.

## What does it mean to deprecate?

When you deprecate a function in any language, you are saying "look, this code won't be around forever and you should stop using it ASAP, but I'll leave it in for a while to give you time to stop using it."

## What does it mean to deprecate in JS?

In static languages there is a compile step. This compile step is usually used as a way to communicate the deprecation to the developers. In JS, there is no such step. Usually this means JS libraries fall back to a less useful means of indicating deprecation: documentation.

When you deprecate your code through documentation, you put burden on the users of your API. Not only do they have to read your documentation to get started using your API, now they also have to _continue_ reading your documentation for as long as they want their code to keep working. This is a huge cost.

But there is another time you an inform the developer that your code is deprecated, and it makes it much easier for developers to know when code they use has been deprecated. That time is runtime.

## How can I deprecate in JS?

Documentation is always a useful fallback. Release notes of your API should indicate what code has been deprecated.

But informing developers of deprecation at runtime means you only inform them of deprecations that might actually affect them.

### Deprecating functions

Functions are easy to deprecate. You simply wrap them in a function that will call `console.log()` the first time it is invoked. Something like:

```js
function deprecateFunction(fn, displayName) {
    var called = false;
    return function() {
        if (!called) {
            called = true;
            console.log('WARNING: ' +
                displayName + ' is deprecated, ' +
                'please stop using it.');
        }
        return fn.apply(this, arguments);
    };
}
```

And you can use it like:

```js
var myFunc = deprecateFunction(function old() {
        // deprecated code ...
}, 'myFunc');

myFunc(); // logs the warning
myFunc(); // doesn't log
```

### Deprecating data

In modern browsers, you can also deprecate data. You can do this with `Object.defineProperty`.

```js
function deprecateData(obj, prop, displayName) {
    var val = obj[prop];
    Object.defineProperty(obj, prop, {
        get : deprecateFunction(function() {
                return val;
            }, displayName),
        set : deprecateFunction(function(newVal) {
                val = newVal;
            }, displayName)
    });
}
```

`Object.defineProperty` lets you define a "get" and "set" function for your data, so that when the variable is read, it evaluates as the value returned from "get". And when it is assigned to, the "set" function is called with the new value.

Don't forget to check that `Object.defineProperty` is supported. In older browsers, just don't log the deprecation. Chances are that self-respecting developers will be using modern browsers anyway. And if not, they should at least be testing in them.

```js
var supportsProperties = false;
try {
    Object.defineProperty({}, 'blam', {
        get:function(){},
        set:function(){}
    });
    supportsProperties = true;
} catch(e){
    /*IE8 only supports properties on DOM elements.*/
}

function deprecateData(obj, prop, displayName) {
    if (supportsProperties) {
        // ...
    }
}
```

And then you can use it like:

```js
var myModel = {
    someOldProperty : 'a value'
};
deprecateData(myModel, 'someOldProperty',
    'myModel.someOldProperty');

// logs a warning in modern browsers
var checkIt = myModel.someOldProperty;
```

And there you go! The basics down!

### A useful deprecation message

So we've gotten our code to log warnings when it is used. But what if you could do more? It would really make a developer's life easy if you told them _when_ the code stopped being valid, _when_ it will stop working altogether, _what_ they can use instead, and _where_ they are currently using the wrong code.

Well the whens and the whats are easy - just add more more inputs to your deprecation methods.

```js
function deprecateFunction(fn, displayName,
    alternateName, vSince, vRemove) {
    var called = false;
    return function() {
        if (!called) {
            called = true;
            console.log('WARNING: ' +
                displayName + ' is deprecated since ' +
                vSince + ' and will be removed in ' + 
                vRemove + '. ' +
                'Use ' + alternateName + ' instead.');
        }
        return fn.apply(this, arguments);
    };
}

function deprecateData(obj, prop, displayName,
    alternateName, vSince, vRemove) {
    var val = obj[prop];
    Object.defineProperty(obj, prop, {
        get : deprecateFunction(function() {
                return val;
            }, displayName, alternateName, vSince, vRemove),
        set : deprecateFunction(function(newVal) {
                val = newVal;
            }, displayName, alternateName, vSince, vRemove)
    });
}
```

Now when you call the deprecated function, you get a detailed message:

```js
var myFunc = deprecateFunction(func,
                'myFunc', 'newFunc', '0.2.0', '1.0.0');

// logs "WARNING: myFunc is deprecated since 0.2.0
// and will be removed in 1.0.0\. Use newFunc instead."
myFunc();
```

Sweet as! But now, how do we let the developer know _where_ there are calling the bad code? Pretty easy in modern browsers: just use the browser's built-in stack traces by creating an `Error` object.

```js
function getStackTrace() {
    return new Error().stack || 'Stacktrace not available';
}
```

Then log it along with the deprecation warning.

## Final code

Here is the final code. For good measure, we'll stick our functions onto a single global `deprecate` variable as `deprecate.fn` and `deprecate.data`;

```js
(function() {
    var supportsProperties = false;
    try {
        Object.defineProperty({}, 'blam', {
            get:function() {},
            set:function() {}
        });
        supportsProperties = true;
    } catch(e){
        /*IE8 only supports properties on DOM elements.*/
    }

    function getStackTrace() {
        return new Error().stack ||
        'Stacktrace not available';
    }

    function deprecateFunction(fn, displayName,
        alternateName, vSince, vRemove) {
        var called = false;
        return function() {
            if (!called) {
                called = true;
                console.log('WARNING: ' +
                    displayName + ' is deprecated since ' +
                    vSince + ' and will be removed in ' + 
                    vRemove + '. ' +
                    'Use ' + alternateName + ' instead.');
                console.log(getStackTrace());
            }
            return fn.apply(this, arguments);
        };
    }

    function deprecateData(obj, prop, displayName,
        alternateName, vSince, vRemove) {
        if (supportsProperties) {
            var val = obj[prop];
            Object.defineProperty(obj, prop, {
                get : deprecateFunction(function() {
                        return val;
                    }, displayName, alternateName, vSince, vRemove),
                set : deprecateFunction(function(newVal) {
                        val = newVal;
                    }, displayName, alternateName, vSince, vRemove)
            });
        }
    }

    window.deprecate = {
        fn : deprecateFunction,
        data : deprecateData
    };
}());
```
