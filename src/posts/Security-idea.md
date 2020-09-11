---
title: Security idea
id: bee92c0726b0bd8e2ee8ff565c5d4233
date: 2013-12-17T03:07:41.826Z
editDate: 2013-12-17T03:07:41.826Z
originalURL: http://www.noiregrets.com/blog/2013/12/17/bee92c07/Security-idea
published: true
tags:
  - eccentricity
  - security
---

You know how some sites say your password has to be at least 6 characters? That's good for security in that more characters are harder to brute force.

But it's bad for security in that the most common password on the Internet is currently "123456" - just enough to fit the length requirement with pretty much no entropy at all. You could brute force usernames always using the password "123456" and probably have a pretty decent success rate.

## ...light bulb?

So here's an idea: Why not randomize the length limit?

> "Your password must be at least {6-10} characters long."

Now you don't know whether the worst password is "123456" or "1234567890". Guessing a single password from the moron group just became 4 times harder (which isn't much, but it's getting somewhere).

This could be extended:

> "Your password must be at least {6-10} characters long and contain at least {0-2} symbols and at least {0-2} uppercase letters."

Now it's 36 times harder. That might actually be a meaningful difference.
