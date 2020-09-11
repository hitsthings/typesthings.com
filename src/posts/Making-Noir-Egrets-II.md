---
title: "Making Noir Egrets, Part II: Hello blogosphere"
id: 461ce40bb59fe426bd9474269e7a646a
date: 2012-11-18T03:48:55.628Z
editDate: 2012-12-30T10:31:36.915Z
originalURL: http://www.noiregrets.com/blog/2012/11/18/461ce40b/Making-Noir-Egrets-Part-II-Hello-blogosphere
published: true
tags:
  - The making of...
  - NodeJS
---

> Imagine a million lunatics wandering the streets mumbling to themselves. Write it all down and put it on the web. Congratulations, you've just created the blogosphere. - [Urban Dictionary](http://www.urbandictionary.com/define.php?term=blogosphere)

What is true of blog content is true of blog software - every wandering lunatic has created their own blogging app at one point or another. Mostly because there are a lot of coding tutorials based around the idea of writing one.

Seeing as Noir Egrets is my personal playground, I thought it would be good to throw down some insane blogging code. ...so I did!

The tools I used were:

* [MongoDB](http://www.mongodb.org/) for the backend
* [Mongoose](http://mongoosejs.com/) for modeling posts
* [Markdown](http://daringfireball.net/projects/markdown) and a [Markdown NPM module](https://npmjs.org/package/markdown) to render content
* [Browserify](https://github.com/substack/node-browserify) to let me use the same Markdown module on the client for previewing.

I gotta say, this blog platform isn't in any way competitive with real platforms out there, but I enjoyed writing it, and it works well enough for me. And in the process, I got to learn a lot about some popular technologies.

## MongoDB

MongoDB has taken a lot of flak for being prone to corruption at scale. I can't really comment on that since this blog isn't popular enough to hit any corruption. I can say it's been a breeze to work with though. I can test very easily (Just need to run a local db with the `mongod` command). And I trialed (and eventually bought) [MongoVUE](http://www.mongovue.com/) which has made it really easy to inspect what's going on.

## Mongoose

MongoDB is a document-store - you can put objects of any arbitrary shape into a collection. That's why I used Mongoose to add some structure. I only wanted "Post" objects in there, so I defined a Post model with mongoose.

I gotta say, I didn't really like the code that makes up Mongoose. It's very spaghetti, poorly documented, and I would guess it doesn't perform very well. But the API is pretty phenomenal. I really like how you define the types of a model's properties, especially Array properties.

```js
var PostSchema = new Schema({
    id : String,
    tags : [ String ]
});
```

It's beautiful! And it's so easy to read that an `id` is a string and `tags` is an array of strings.

## Markdown

I have mixed feelings about Markdown, but it's popular and it works, so I went with it. The module I choose offers a few different flavors, and seems to be fairly well written so I went with it.

## Browserify

Browserify was a bit of a hack for this. I wanted to make sure my previews were WYSIWYG, so I used browserify to make sure the same code that does the conversion in the backend is used in the front-end. Consudering there aren't a lot of dependencies with Markdown, Browserify made it super easy to load it client-side.

I'm using Grunt for builds, so I quickly wrote up something to call out to browserify from a Grunt task:

```js
grunt.registerMultiTask('browserify', 'Run browserify on a file', function() {
    //var inputs = grunt.file.expandFiles(this.file.src);
    var inputs = grunt.config(['browserify', this.target, 'src']);
    var output = grunt.config(['browserify', this.target, 'dest']);
    fs.writeFile(output, require('browserify')({
        exports: ['require'],
        require: inputs
    }).bundle(), this.async());
});
```

But it looks like there are [other grunt-browserify solutions](https://github.com/pix/grunt-browserify) that have been written since then.

The downside is that the markdown rendering is now 70kB being sent to the client, but for now that's pretty meh to me. Playgrounds don't have to worry about payload. :)
