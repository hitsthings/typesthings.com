const markdownIt = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true
}).use(require('markdown-it-imsize'));

module.exports = value => markdownIt.render(value);
module.exports.lib = markdownIt;
