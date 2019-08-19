document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById.bind(document);
  const $search = el('search');
  const $copyBtn = el('copyBtn');
  const $clipboard = el('clipboard');

  // transform emojilib into simple array of emoji data objects
  // put key name into 'name' property
  const data = Object.entries(window.emojilib).map(([name, obj]) => ({name, ...obj}));
  console.log(data);

  // bind events
  const filter = emoji.filter(data); // 2nd order fn
  
  $search.addEventListener('input', ({target: {value}}) => filter(value));
  $copyBtn.addEventListener('click', evt => {
    evt.preventDefault();
    evt.stopPropagation();
    emoji.copyToClipboard();
  })
  document.addEventListener('click', ({target} = {}) => {
    // TODO: presumes we've prevented any other buttons from bubbling up to document
    if (target.tagName === 'BUTTON') {
      emoji.onPressEmoji(target.innerText);
    }
  });
  // document.getElementById('results').innerHTML = emoji.htmlForAllEmoji(chars);
});