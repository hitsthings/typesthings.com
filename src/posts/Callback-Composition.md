---
title: "Functional NodeJS -  callback composition"
id: c2c15dbf38d1e48e15554d69d02c9e2b
date: 2013-09-08T06:53:28.472Z
editDate: 2013-10-19T01:54:02.858Z
originalURL: http://www.noiregrets.com/blog/2013/09/08/c2c15dbf/Functional-NodeJS-callback-composition
published: true
tags:
  - functional programming
  - NodeJS
  - JS tips
---

I've been trying to get into functional programming a bit, and just had the opportunity to create a function I haven't seen before. I also found out just how unfriendly Node's conventions can be to functional programmers.

I thought I'd share just how difficult this can get, and try to explain each step for anyone else trying to understand functional concepts.

I'll cover `partial` and `compose` which are a widely used higher order functions. Then I'll show you `partialRight` which I haven't seen before, and talk about how it can help you combine NodeJS-style asynchronous functions.

## "partial", prior art

Most functional libraries have something called `partial` which is super useful. This function lets you fill in arguments left to right, without affecting the `this` value of the function.

Let's set up an example:

```js
function logMyName(logger) {
    logger.log(this.name);
}

function Dog(name) {
    this.name = name;
}
Dog.prototype.print = logMyName;
```

Say you wanted `Dog` to use a version of `logMyName` that always logged the name using `console.log`.

If you were to use the built-in `Function.prototype.bind` in ES5, you'd be stuck.

```js
Dog.prototype.print = logMyName.bind(?, console);
```

There's no good value for `?` that will work, because `this` needs to change dynamically with the instance of `Dog` that calls it. You really want to use `partial`.

```js
Dog.prototype.print = partial(logMyName, console);
```

This means the first argument, `logger` will be set to `console`, but will continue to see the correct `this` value when called.

```js
var myDog = new Dog('Lassie');
myDog.print(); // logMyName.call(myDog, console)
```

## partial, not a complete solution

I had a similar problem in NodeJS. I was looking at implementing a function that will "compose" other functions. That means it will call each function, right-to-left, with the result of the previous function.

```js
var composed = compose(a, b, c);
composed(1) === a( b( c(1) ) );
```

BUT, I wanted it to work with Node-style asynchronous functions.

The [async](https://github.com/caolan/async#compose) library already has this (which is awesome), but I felt like writing my own, to help me get into the functional programming swing.

Given a call like

```js
var cThenBThenA = composeAsync(a, b, c);
```

I wanted to be able to call it like:

```js
function next(err, res) {
    // callback
}
cThenBThenA(1, next);
```

This should be equivalent to the much more long-winded:

```js
function next(err, res) {
    // callback
}
c(1, function(err, cRes) {
    err ?
        next(err) :
        b(cRes, function(err, bRes) {
            err ?
                next(err) :
                a(bRes, next);
        });
});
```

So what do we need to do to get there?

Well there are two big hurdles. The first is that tedious error handling. Notice how we manually short-circuit and call `next` any time we see an error? Let's write a function that handles those Node-style errors:

```js
function handleError(errback, callback) {
    return function (err) {
        err ?
            errback(err) :
            callback.apply(this,
                [].slice.call(arguments, 1));
    };
}
```

This function will take in a function to call when there is an error (`errback`) and a function to call when there's no error (`callback`). It returns a function that will call whichever one is appropriate and give it the correct arguments: either just the error for `errback`, or everything except the error for `callback`.

This makes it a bit better:

```js
function next(err, res) {
    // callback
}
c(1, handleError(next, function(cRes) {
    b(cRes, handleError(next, function(bRes) {
        a(bRes, next);
    });
});
```

And we can use the `partial` function we just learned to improve it even more, by binding the `handleError` function to the `next` callback.

```js
function next(err, res) {
    // callback
}
var nextOnError = partial(handleError, next);
c(1, nextOnError(function(cRes) {
    b(cRes, nextOnError(function(bRes) {
        a(bRes, next);
    });
});
```

But even though we've removed the repetitive error-handling logic, we still have that annoying callback stack.

Notice how we need to inject a unique callback parameter at the _end_ of each function call? This isn't something where you can use `partial`. The partial function only lets you specify parameters left-to-right, which means we'd have to know the arguments to pass in. For example:

```js
function next(err, res) {
    // callback
}
var nextOnError = partial(handleError, next);

var aWithCallback = partial(a, bRes?, next);
var callA = nextOnError(aWithCallback);

var bWithCallback = partial(b, cRes?, callA);
var callB = nextOnError(bWithCallback);

c(1, callB);
```

This almost works - we try to bind each function to a callback. But we're tripped up with the `bRes` and `cRes` bits. We don't know those results yet, because those functions haven't been called! And we can't partially apply _just_ the callback, because `partial` works left-to-right.

## Enter partialRight

So I wrote a function to work like partial, but appends the arguments _after_ the ones passed in. It looks like this:

```js
function partialRight(fn/*, ...args*/) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var firstArgs = [].slice.call(arguments);
        return fn.apply(this, 
            firstArgs.concat(args));
    };
}
```

Easy! Now I can inject _just_ a callback, without knowing the other arguments `bRes` and `cRes`.

```js
var aWithCallback = partialRight(a, next);
aWithCallback(?) === a(?, next);
```

So the whole chain becomes:

```js
function next(err, res) {
    // callback
}
var nextOnError = partial(handleError, next);

var aWithCallback = partialRight(a, next);
var callA = nextOnError(aWithCallback);

var bWithCallback = partialRight(b, callA);
var callB = nextOnError(bWithCallback);

c(1, callB);
```

And now we're almost there! Just need to turn the manual `callA` and `callB` functions into something we can iterate over for any number of functions. We do this with a map to add the `nextOnError`, and a reduce to add the callbacks:
```js
function next(err, res) {
    // callback
}
var nextOnError = partial(handleError, next);
// turn each function into a version of itself
// that is a Node-style callback.
var callFns = [a,b,c].map(nextOnError);

// connect each function to its callback,
// without knowing its other arguments
var composed = callFns.reduce(function(cb, fn) {
    return partialRight(fn, cb);
}, next);

composed(null, 1);
```

Notice that we now call `composed` with a null first. This is because we turned `c` into a Node-style callback as well, so we have to specify that there is no error when we call it.

So here's the `composeAsync` we end up with:

```js
function composeAsync() {
    var fns = toArray(arguments);
    return function() {
        var args = toArray(arguments);
        var next = args.pop();
        var nextOnError = partial(handleError, next);
        var callFns = fns.map(nextOnError);

        var composed = callFns.reduce(function(next, fn) {
            return partialRight(fn, next);
        }, next);

        composed.apply(this, [ null ].concat(args));
    };
}
```

And it works!

```js
function add1(a, next) {
    next(null, a+1);
}

function mul2(a, next) {
    next(null, a*2);
}

composeAsync(add1, mul2, add1)(1, function next(err, res) {
    console.log(res); // ((1 + 1) * 2) + 1 == 5
});
```

I'll write another post on why `compose` is cool, but I recommend checking out [Brian Lonsdorf's talk](http://functionaltalks.org/2013/05/27/brian-lonsdorf-hey-underscore-youre-doing-it-wrong/) which gets the message across.

[Gist including all the code](https://gist.github.com/hitsthings/6482549)