const htmlToText = require('html-to-text');

const add = (a,b) => a+b;

module.exports = {
  getNextHeadingLevel(currentLevel) {
    return parseInt(currentLevel, 10) + 1;
  },
  getReadingTime(html) {
    const wordsPerMinute = 200;
    const codeTokensPerMinute = 40;
    const { prose, code } = html.split(/<pre[^>]*>|<\/pre[^>]*>/g).reduce((out, str, i) => {
      (i % 2 === 0 ? out.prose : out.code).push(htmlToText.fromString(str));
      return out;
    }, {prose:[], code:[]})
    const numberOfWords = prose.map(text => text.split(/\s/g).length).reduce(add, 0);
    const numberOfCodeTokens = code.map(text => text.split(/\b/g).length).reduce(add, 0);
    return Math.ceil((numberOfWords / wordsPerMinute) + (numberOfCodeTokens / codeTokensPerMinute));
  }
};
