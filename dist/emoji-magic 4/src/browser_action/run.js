document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById.bind(document);
  const $search = el('search');
  const $copyBtn = el('copyBtn');
  
  // transform emojilib into simple array of emoji data objects
  // put key name into 'name' property
  const data = Object.entries(window.emojilib).map(([name, obj]) => ({name, ...obj}));
  const filterWith = emoji.filter(data); // 2nd order fn
  
  // Filter as you type
  $search.addEventListener('input', ({target: {value}}) => filterWith(value));

  // If you press "enter" in the search box, immediately copy the first emoji
  $search.addEventListener('keyup', evt => {  
    if (evt.key === 'Enter' || evt.keyCode === 13) {
      emoji.copyFirstEmoji();
    }
  });

  // If you hit the copy button, make it happen
  $copyBtn.addEventListener('click', evt => {
    evt.preventDefault();
    evt.stopPropagation();
    emoji.copyToClipboard({instant: true});
  })

  // if you click any other buttons (emojis), copy them.
  document.addEventListener('click', (evt) => {
    // TODO: presumes we've prevented any other buttons from bubbling up to document
    if (evt.target.tagName === 'BUTTON') {
      emoji.onPressEmoji(evt.target.innerText);
    }
  });
  document.addEventListener('keyup', (evt) => {
    // if you use the arrow keys, move focus
    switch (evt.key) {
      case 'ArrowLeft':
        emoji.moveFocusX(-1);
        break;
      case 'ArrowRight':
        emoji.moveFocusX(+1);
        break;
      case 'ArrowUp':
        emoji.moveFocusY(-1);
        break;
      case 'ArrowDown':
        emoji.moveFocusY(+1);
        break;
    }
  });
});