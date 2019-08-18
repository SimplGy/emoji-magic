
window.emoji = (function() {
  const filter = (data) => (str) => {
    console.log('emoji.onChangeFilter', str, data);
    // filter the data set
    // get just the chars
    // render
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










