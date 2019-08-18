
window.emoji = (function() {

  // given blob of data, return array of emoji chars
  const charsFromEmojilibData = (data = []) => data.map(({char}) => char);
  // does anything in this array start with str?
  const someStartWith = (arr, str) => arr.some(a => a.startsWith(str));
  const someInclude = (arr, str) => arr.some(a => a.includes(str));

  // 2nd order. given data and str, return true if data has it
  const emojiMatches = (str) => ({name, keywords = []} = {}) =>
    name.includes(str) || someInclude(keywords, str); 



  const filter = (data = []) => (str) => {
    


    // filter the data set
    results = data.filter(emojiMatches(str));

    if (results.length < 10) console.log(results);

    const chars = charsFromEmojilibData(results);

    // render
    render(chars)
  };

  


  function getResults(filter) {

  }

  function htmlForAllEmoji(charArray = []) {
    const html = charArray.map(htmlForEmoji).join('\n');
    return html
  }

  function htmlForEmoji(char) {
    return `<li><button>${char}</button></li>`;
  }

  // Dom aware
  function render(chars) {
    document.getElementById('results').innerHTML = htmlForAllEmoji(chars);
  }

  // function htmlToElement(html) {
  //   var template = document.createElement('template');
  //   html = html.trim(); // Never return a text node of whitespace as the result
  //   template.innerHTML = html;
  //   return template.content.firstChild;
  // }

  return {
    filter,
    htmlForAllEmoji,
  }
})();










