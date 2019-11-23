/*
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById.bind(document);
  const $search = el('search');
  const $copyBtn = el('copyBtn');
  
  // transform emojilib into simple array of emoji data objects
  // put key name into 'name' property
  // const data = Object.entries(window.emojilib).map(([name, obj]) => ({name, ...obj}));
  const filterWith = emoji.filter(emoji_data.array); // 2nd order fn
  
  // Filter as you type
  $search.addEventListener('input', ({target: {value}}) => {
    const chars = filterWith(value);

    // TODO: If no results, use thesaurus
    // if (results.length === 0) {
    //   filterWith(value, {useThesaurus: true});
    // }

    emoji.render(chars);
  });

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

  // Start things off with a blank search
  emoji.render(filterWith(''));
});