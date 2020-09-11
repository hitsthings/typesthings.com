---
title: "Making Noir Egrets, Part I: The Middleware Way"
id: 22b9b500075119a2c16473b03e14e286
date: 2012-06-30T10:35:56.172Z
editDate: 2012-06-30T13:49:40.172Z
originalURL: http://www.noiregrets.com/blog/2012/06/30/22b9b500/Making-Noir-Egrets-Part-I-The-Middleware-Way
published: true
tags:
  - The making of...
  - NodeJS
---

I know I'm pretty behind the times, but I've finally gotten into NodeJS, and I'm loving it! Coming from C# (also good) and Java (not so good) backends, it's really refreshing getting all the benefits of an interpreted, dynamically-typed language like JS on the server.

![Picture of Slowpoke saying "I'm using NodeJS, you've probably never heard of it."](/images/SLOWPOKE.jpg " ")

I'd been trying out all the stuff the cool kids get to use, and I decided I need some place to _put_ it. I could have used GitHub or Bitbucket to host my projects, but a real geek needs a cyberplace to call their own, so I decided to write up a NodeJS-based website.

I'd heard good things about [Express](http://expressjs.com/), so I gave that a go. I gotta say, I _love_ the concept of middleware that is at the heart of Connect (which Express is built on). Why? Number one, because there is a phenomenal amount of reusable code. And number two, because it promotes _you_ writing just as reusable modular code yourself.

For example, say you want to check a session cookie to see if a user is logged in. You could first make use of the existing `express.cookieParser` middleware to grab the keys in the cookie, then the `express.session` middleware to grab the express session cookie and take parameters from it:

```js
// parse request.headers.cookie into request.cookies using a secret key for signed cookies.
app.use(express.cookieParser("Zombo.com"));

// parse the session values from request.cookies
app.use(express.session({ secret: 'happiness is self-control' }));
```

When you see `app.use(func)` that means "for every request, call `func`". The cool thing about it is the functions will be called in the order that you `use` them. So like in our example, one can rely on another when you call them in the correct order. So I can write

```js
function checkCookie(request, response, next) {
    var user = getUserById(request.session.userId);
    if (user) {
        request.user = user;
    }
    next();
}
app.use(checkCookie);
```

And `checkCookie` will have access to the session variables that `express.session` parsed out for us. In this case the assumption is that I set `request.session.userId` and call `request.session.save()` when you log in, which makes the it available for all subsequent requests.

You'll notice the standard function signature for middleware. The first parameter is the `request`, the second parameter is the `response`, and the third parameter, `next`, is a callback. If you want to end the chain of middleware, you ignore that callback. If you want to invoke the error handler, you call it with an error argument:

```js
next(new Error("shit.hit(fan)"))
```

If you just want to let the next guy have his turn, you call it with nothing.

```js
next()
```

Here are some other examples of how gloriously reusable middleware can be. I've written these for Noir Egrets and other apps:

* "flash" session storage for showing success/error messages after a redirect:

    ```js
    // Anything saved in req.session.flash is removed from session, and is accessible in
    // req.flash for the next request only.
    function flash() {
        return function(req, res, next) {
            if (req.session.flash) {
                req.flash = req.session.flash;
                delete req.session.flash;
                req.session.save(next);
            } else {
                next();
            }
        };
    }
    ```

* Allowing cross-origin access to my APIs:

    ```js
    function allowCORS(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    }
    ```

* or setting specific caching times:

    ```js
    function cacheFor(seconds) {
        return function (req, res, next) {
            res.header('Cache-Control', 'public, max-age=' + seconds);
            next();
        };
    }
    ```

They can be used globally with `app.use`, or just for specific routes like:

```js
app.get('/api/things',
    flash(),
    allowCORS,
    cacheFor(60),
function(req, res, next) {
    /* do the real work of rendering some Things. */
});
```

Middleware was by far the greatest part about trying out Express. It's an amazing concept.
