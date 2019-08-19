
window.emoji = (function() {

  // given blob of data, return array of emoji chars
  const charsFromEmojilibData = (data = []) => data.map(({char}) => char);
  // does anything in this array start with str?
  const someStartWith = (arr, str) => arr.some(a => a.startsWith(str));
  const someInclude = (arr, str) => arr.some(a => a.includes(str));

  // 2nd order. given data and str, return true if data has it
  const emojiMatches = (str) => ({name, keywords = []} = {}) =>
    name.includes(str) || someInclude(keywords, str);

  // from David Walsh
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };


  const filter = (data = []) => (str) => {
    results = data.filter(emojiMatches(str));       // 1. filter to matches
    const chars = charsFromEmojilibData(results);   // 2. get plain chars
    render(chars);                                  // 3. render
  };

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

  // Dom aware
  function onPressEmoji(char) {
    console.log(char);
    const $clipboard = document.getElementById('clipboard');
    $clipboard.value += char;
    copyToClipboard();
  }

  // Dom aware
  // true if there are any items in the tray ready to copy
  function clipboardHasStuff() {
    const $clipboard = document.getElementById('clipboard');
    return $clipboard.value.trim().length > 0;
  }
  
  // Dom aware
  function copyToClipboard() {
    if (!clipboardHasStuff()) return;
    const $clipboard = document.getElementById('clipboard');
    $clipboard.select();
    document.execCommand('copy');
    $clipboard.blur();
    animateCopySuccess();
    setTimeout(closePopup, 1000);
  }

  const animateCopySuccess = debounce(function animateCopySuccess() {
    const $copyBtn = document.getElementById('copyBtn');
    $copyBtn.innerText = "Copied";
    const animation = 'tada'; // from https://github.com/daneden/animate.css
    $copyBtn.classList.add(animation);
    setTimeout(() => $copyBtn.classList.remove(animation), 800); // match animation speed: https://github.com/daneden/animate.css#slow-slower-fast-and-faster-class
    setTimeout(() => $copyBtn.innerText = "Copy", 1000);
  }, 200);

  function closePopup() {
    window.close();
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
    onPressEmoji,
    copyToClipboard,
  }
})();










