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
const {toChars, toChar, toObj, array} = require('./emoji_data');
const store = require('../js_utils/store');

module.exports = (() => {
  const CLIPBOARD_CLEAR_DELAY = 1000; // how long to leave the psuedo-clipboard content in place before clearing. (this user visible "clipboard" is what enables clicking three times in a row to copy a set of three emoji)
  const CLOSE_POPUP_DELAY = 800; // How long to wait after a successful copy before closing the browser extension popup
  const ANIMATION = 'tada'; // must match a css class
  const TADA_ANIM_DURATION = 400; // should match css animation duration
  const SHOW_COPIED_MSG_DURATION = 1000; // how long to show the "copied" message (on the button)
  const RECENT_KEY = 'recent-selections';
  const RESULT_LIMIT = 8 * 15; // for render perf, don't draw everything. 15 rows fit in Chrome's 600px height limit for default font size/zoom settings.
  const RECENT_SELECTION_LIMIT = 8 * 1; // at the default font size, there are 8 per row
  const DEFAULT_RESULTS = ['🔮','🎩','✨','🐇'];
  const WORD_SEPARATORS = /\s+/; // Specifies how search strings are tokenized
  let recentSelections = []; // in memory store of recent selections. format is plain chars, not objects
  store.get(RECENT_KEY, val => recentSelections = val || []); // seed the recentSelections
  let willClearClipboard; // reference to the timeout that will clear this

  // does anything in this array start with str?
  const someStartWith = (arr, str) => arr.some(a => a.startsWith(str));
  const someInclude = (arr, str) => arr.some(a => a.includes(str));

  // 2nd order. given data and str, return true if data has it
  const emojiMatches = (str) => ({name, keywords = []} = {}) =>
    name.includes(str) || someInclude(keywords, str);

  // 2nd order. given data and str, return true if data has it
  // also search thesaurus words if they're in the data set
  const emojiMatchesThesaurus = (str, useThesaurus = false) =>
    ({name, keywords = [], thesaurus = []} = {}) => {
      thesaurus = flatten(thesaurus);
      return name.includes(str) || someInclude(keywords, str) || someInclude(thesaurus, str);
    }

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

  // Given any number of arrays, return the smallest intersection
  // No order is guaranteed
  // Does not mutate input arrays
  function intersection(...arrays) {
    return arrays.reduce((acc, cur) =>
      acc.filter(p => cur.includes(p))
    );
  }

  // Given an array of arrays, return a flat array. Depth 1
  function flatten(arr) {
    return arr.reduce((acc, val) => acc.concat(val), []);
  }
  
  
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

  // Main search method.
  // Given a search string, return an array of matching emoji objects
  // The data is usually pre-bound but you can provide your own data set as well (eg: testing)
  const searchOn = (data = []) => (str = '', { useThesaurus } = {}) => {
    str = str.trim();
    let results;
    let chars;
    
    // Blank search? Exit early.
    if (str === '') {
      chars = recentSelections.length > 0 ? recentSelections.map(toObj) : DEFAULT_RESULTS.map(toObj);
      return chars;
    }

    // Get matching chars for each of the search tokens
    const tokens = str.split(WORD_SEPARATORS);
    const resultsPerToken = tokens.map(token => {
      if (useThesaurus) {
        results = data.filter(emojiMatchesThesaurus(token));
      } else {
        results = data.filter(emojiMatches(token));
      }
      return results;
    });

    // Must match all search tokens
    chars = intersection(...resultsPerToken);

    return chars;
  };

  function htmlForAllEmoji(emojiArray = []) {
    const html = emojiArray.map(htmlForEmoji).join('\n');
    return html
  }

  function htmlForEmoji(emoji) {
    const char = toChar(emoji);
    return `<li><button title='${summaryString(emoji)}'>${char}</button></li>`;
  }

  // Take an emoji object and summarize it as a multiline string (useful for tooltips)
  function summaryString(emoji) {
    const { keywords = [], thesaurus = []} = emoji
    return `${emoji.char} ${emoji.name}\n\n` +
    `keywords: ${keywords.join(', ')}\n\n` +
    thesaurus
      .filter(arr => arr.length > 0)
      .map((arr, idx) => `${keywords[idx]}:\n${arr.join(', ')}`).join('\n\n')
  }

  // Dom aware
  // Tasks: Put result html into container, update disabled state of btn
  function render(emoji = []) {
    emoji = emoji.slice(0, RESULT_LIMIT);
    $.results().innerHTML = htmlForAllEmoji(emoji);
    if (emoji.length === 0) {
      $.copyBtn().setAttribute('disabled', true);
    } else {
      $.copyBtn().removeAttribute('disabled');
    }
  }

  // Dom aware
  function onPressEmoji(char) {
    $.clipboard().value += char;

    // Every so often, clear this "clipboard"
    clearTimeout(willClearClipboard);
    willClearClipboard = setTimeout(clearClipboard, CLIPBOARD_CLEAR_DELAY);

    trackRecent(char);
    copyToClipboard();
  }

  // Dom aware
  // true if there are any items in the tray ready to copy
  function clipboardHasStuff() {
    return $.clipboard().value.trim().length > 0;
  }

  function clearClipboard() {
    $.clipboard().value = '';
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
      setTimeout(closePopup, CLOSE_POPUP_DELAY);
    }
  }

  const animateCopySuccessDebounced = debounce(animateCopySuccess, 200);

  function animateCopySuccess() {
    const $copyBtn = document.getElementById('copyBtn');
    $copyBtn.innerText = "Copied";
    $copyBtn.classList.add(ANIMATION);
    $copyBtn.classList.add('copied');
    setTimeout(() => $copyBtn.classList.remove(ANIMATION), TADA_ANIM_DURATION);
    setTimeout(() => $copyBtn.innerText = "Copy", SHOW_COPIED_MSG_DURATION);
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

  // Given an emoji, return an array of code points.
  // Must be an array to support multichar emoji like "🇨🇨" (2) and "🙇‍♀️" (4)
  function toCodePoints(char) {
    return Array.from(char).map(s => s.codePointAt(0));
  }

  // Given an array of numeric "code points", return a char
  function fromCodePoints(arr = []) {
    return arr.map(n => String.fromCodePoint(n)).join('');
  }



  return {
    searchOn,
    search: searchOn(array),
    render,
    htmlForAllEmoji,
    onPressEmoji,
    copyToClipboard,
    copyFirstEmoji,
    moveFocusX,
    moveFocusY,
    toCodePoints,
    fromCodePoints,
    closePopup,
    __id__: 'emoji',
  }
})();
