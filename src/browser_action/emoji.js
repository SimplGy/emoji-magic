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
const {toChars} = require('./emoji_data');
const store = require('./store');

module.exports = (() => {
  const RECENT_KEY = 'recent-selections';
  const RESULT_LIMIT = 96; // for render perf, don't draw everything
  const RECENT_SELECTION_LIMIT = 8 * 1; // at the default font size, there are 8 per row
  const DEFAULT_RESULTS = ['🔮'];
  let recentSelections = []; // in memory store of recent selections. format is plain chars, not objects
  store.get(RECENT_KEY, val => recentSelections = val || []);

  // does anything in this array start with str?
  const someStartWith = (arr, str) => arr.some(a => a.startsWith(str));
  const someInclude = (arr, str) => arr.some(a => a.includes(str));

  // 2nd order. given data and str, return true if data has it
  const emojiMatches = (str) => ({name, keywords = []} = {}) =>
    name.includes(str) || someInclude(keywords, str);

  const $ = {
    results: () => document.getElementById('results'),
    clipboard: () => document.getElementById('clipboard'),
    copyBtn: () => document.getElementById('copyBtn'),
    search: () => document.getElementById('search'),
  };

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
  
  
  // add recent selection, but only track the most recent k
  // also deduplicates: if it's already present, remove matches first before putting the most recent at the front
  function trackRecent(char) {
    recentSelections = recentSelections.filter(c => c !== char);
    recentSelections.unshift(char);
    if (recentSelections.length > RECENT_SELECTION_LIMIT) {
      recentSelections = recentSelections.slice(0, RECENT_SELECTION_LIMIT);
    }
    store.set(RECENT_KEY, recentSelections);
  }

  const filter = (data = [], skipRender = false) => (str = '') => {
    str = str.trim();
    let results;
    let chars;
    
    if (str !== '') {
      results = data.filter(emojiMatches(str)); // 1. filter to matches
      chars = toChars(results);   // 2. get plain chars
    } else {
      chars = recentSelections.length > 0 ? recentSelections : DEFAULT_RESULTS;
    }

    if (!skipRender) {
      render(chars);                            // 3. render
    }

    return chars;
  };

  function htmlForAllEmoji(charArray = []) {
    const html = charArray.map(htmlForEmoji).join('\n');
    return html
  }

  function htmlForEmoji(char) {
    return `<li><button>${char}</button></li>`;
  }

  // Dom aware
  // Tasks: Put result html into container, update disabled state of btn
  function render(chars = []) {
    chars = chars.slice(0, RESULT_LIMIT);
    $.results().innerHTML = htmlForAllEmoji(chars);
    if (chars.length === 0) {
      $.copyBtn().setAttribute('disabled', true);
    } else {
      $.copyBtn().removeAttribute('disabled');
    }
    const disabled = true;
    
  }

  // Dom aware
  function onPressEmoji(char) {
    $.clipboard().value += char;

    // Which emoji?
    trackRecent(char);

    copyToClipboard();
  }

  // Dom aware
  // true if there are any items in the tray ready to copy
  function clipboardHasStuff() {
    return $.clipboard().value.trim().length > 0;
  }

  // true if there are no results in dom right now
  function noResults() {
    return $.results().hasChildNodes()
  }
  
  // Dom aware
  function copyToClipboard({instant = false} = {}) {
    if (!clipboardHasStuff()) return;
    
    // Select the text and copy, then return focus to where it was
    const focusedEl = document.activeElement; // what used to be focused? make sure to reselect it.
    $.clipboard().select();
    document.execCommand('copy');
    focusedEl.focus();

    // Animate success and close popup
    if (instant) {
      animateCopySuccess();
      closePopup();
    } else {
      animateCopySuccessDebounced();
      setTimeout(closePopup, 1000);
    }
  }

  const animateCopySuccessDebounced = debounce(animateCopySuccess, 200);

  function animateCopySuccess() {
    const $copyBtn = document.getElementById('copyBtn');
    $copyBtn.innerText = "Copied";
    const animation = 'tada'; // from https://github.com/daneden/animate.css
    $copyBtn.classList.add(animation);
    $copyBtn.classList.add('copied');
    $copyBtn.setAttribute('disabled', true);
    setTimeout(() => $copyBtn.classList.remove(animation), 800); // match animation speed: https://github.com/daneden/animate.css#slow-slower-fast-and-faster-class
    setTimeout(() => $copyBtn.removeAttribute('disabled'), 1500);
    setTimeout(() => $copyBtn.innerText = "Copy", 1500);
  }

  function closePopup() {
    // don't bother for unit tests/node
    if (typeof window.close === 'function') {
      window.close();
    }
  }

  function copyFirstEmoji() {
    const btn = $.results().querySelector('button'); // get the first button
    if (!btn) return;
    const char = btn.innerText;
    $.clipboard().value = char;
    copyToClipboard({instant: true});
  }

  // Move focus horizontally. +1 is right, -1 is left.
  // wraps around
  // boundary protection works because focusOn just exits if it doesn't find an el to focus
  // really really dom coupled
  function moveFocusX(direction = 0) {
    const curLi = document.activeElement.parentElement;
    const idx = Array.from($.results().children).indexOf(curLi);
    focusOn(idx + direction);
  }

  // +1 is down, -1 is up
  function moveFocusY(direction = 0) {
    const wasFromSearch = document.activeElement === $.search();
    let el = document.activeElement.parentElement;
    const left = el.offsetLeft;
    const top = el.offsetTop;
    let prevEl;

    // if we're going down a row...
    if (direction > 0) {
      // 1. look forward until we find something with a higher offsetTop (first el of next row)
      while(el && el.offsetTop <= top) {
        prevEl = el;
        el = el.nextElementSibling;
      }

      // 2. look forward until we find something >= the current offsetLeft (same col, or close)
      while (el && el.offsetLeft < left) {
        prevEl = el;
        el = el.nextElementSibling;
      }
      
      // another approach: just look for the next element with nearly the same left position, it'll be in the next row.
      // I like the way the current one handles sparse rows though.

    // if we're going up a row...
    } else if (direction < 0) {
      // 1. look backward until we find something with a lower offsetTop (last el of previous row)
      while(el && el.offsetTop >= top) {
        prevEl = el;
        el = el.previousElementSibling;
      }
      // 2. look backward until we find something <= the current offsetLeft
      while (el && el.offsetLeft > left) {
        prevEl = el;
        el = el.previousElementSibling;
      }
    }

    if (el) {
      focusOnButton(el);
    } else if(prevEl) {
      // if moving up and we didn't find a correct focus target, choose the search box
      if (direction < 0) {
        $.search().focus();
        $.search().select();
      // if moving down from search
      } else if(wasFromSearch && direction > 0) {
        focusOn(0);
      } else {
        focusOnButton(prevEl);
      }
    }

  }

  // really really dom coupled
  function focusOn(idx) {
    const li = $.results().children[idx];
    if (!li) return;
    focusOnButton(li);
  }

  function focusOnButton(el) {
    const btn = el.querySelector('button');
    if (!btn) return;
    btn.focus();
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
    copyFirstEmoji,
    moveFocusX,
    moveFocusY,
    __id__: 'emoji',
  }
})();
