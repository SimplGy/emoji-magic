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

const {toChar, toObj, array} = require('./emoji_data');
const store = require('../js_utils/store');
const {minPrefixOverlapsByWordSet} = require('../js_utils/matchers');
const {fromCodePoints, toCodePoints} = require('../js_utils/code_points'); // re-exporting these for convenience



module.exports = (() => {
  const CLIPBOARD_CLEAR_DELAY = 1000; // how long to leave the psuedo-clipboard content in place before clearing. (this user visible "clipboard" is what enables clicking three times in a row to copy a set of three emoji)
  const CLOSE_POPUP_DELAY = 800; // How long to wait after a successful copy before closing the browser extension popup
  const ANIMATION = 'tada'; // must match a css class
  const TADA_ANIM_DURATION = 400; // should match css animation duration
  const SHOW_COPIED_MSG_DURATION = 600; // how long to show the "copied" message (on the button)
  const RECENT_KEY = 'recent-selections';
  const RESULT_LIMIT = 8 * 15; // for render perf, don't draw everything. 15 rows fit in Chrome's 600px height limit for default font size/zoom settings.
  const RECENT_SELECTION_LIMIT = 8 * 1; // at the default font size, there are 8 per row
  const DEFAULT_RESULTS = ['🔮','🎩','✨','🐇'];
  let recentSelections = []; // in memory store of recent selections. format is plain chars, not objects
  store.get(RECENT_KEY, val => recentSelections = val || []); // seed the recentSelections
  let willClearClipboard; // reference to the timeout that will clear this

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
    
    // Blank search? Exit early.
    if (str === '') {
      return recentSelections.length > 0 ? recentSelections.map(toObj) : DEFAULT_RESULTS.map(toObj);
    }

    const matchesByStrength = data
      .map(r => [
        r,
        {
          match: matchStrengthFor(r, str),
          matchVector: matchKeywordsAndThesaurus(r, str),
        },
      ])
      .filter(r => r[1].match > 0)
      .sort((a, b) => b[1].match - a[1].match)
      .map(r => r[0]); // plain emoji again

    // TODO: make it obvious which words are matching, so it's not confusing why unrelated-seeming results appear
    // console.log(matchesByStrength.map(({char, match}) => char + ' ' + match));

    return matchesByStrength;
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

    `keywords: ${keywords.join(', ')}\n` +
    `version (emoji/unicode): ${emoji.emoji_version} / ${emoji.unicode_version}\n\n` +

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

  // Close the popup, but not if:
  // 1) we're in a unit test (node)
  // 2) We're on the demo/webapp, rather than in the Chrome browser_popup
  function closePopup() {
    if (typeof window.close === 'function' && chrome.browserAction) {
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
    const wasFromSearch = document.activeElement === $.search();
    if (wasFromSearch) return; // don't do custom arrow behavior if we're in the search box already
    const curLi = document.activeElement.parentElement;
    const idx = Array.from($.results().children).indexOf(curLi);
    focusOn(idx + direction);
  }

  // +1 is down, -1 is up
  function moveFocusY(direction = 0) {

    // special case: moving down from search
    const wasFromSearch = document.activeElement === $.search();
    if(wasFromSearch) {
      if (direction > 0) {
        focusOn(0);
      }
      return; // don't do custom arrow behavior if we're in the search box already
    }

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

  /*
  example emoji object:
  {
    "name": "grinning",
    "keywords": [
      "face",
      "smile",
      "happy",
      "joy",
      ":D",
      "grin"
    ],
    "char": "😀",
    "category": "people",
    "thesaurus": [
      ["human face","external body part"],
      ["expression","look"]
    ]
  }
  */

  /*
   * For a given emoji object and query, return a numeric "strength" for the match.
   * It gets match strength for all the terms on 2 dimensions:
   * 1: Keywords
   * 2: Thesaurus
   * 
   * It then averages the match strength on each dimension.
   * To simplify sorting, it returns the keyword match strength in standard order,
   * summed with the thesaurus match strength divided by 1000
   * eg: 1 number: `0.501` (indicating a 50% avg keyword match and a 100% avg thesaurus match)
   */
  function matchStrengthFor(emojiObj = {}, query = '') {
    const [k, t] = matchKeywordsAndThesaurus(emojiObj, query);
    // console.log(`\nmatchStrengthFor('${emojiObj.char}', '${query}') keywordMatches`, k)
    // console.log(`\nmatchStrengthFor('${emojiObj.char}', '${query}') thesaurusMatches`, t)
    return k + t/1000; // eg: 1.001 or 0.005
  }

  function matchKeywordsAndThesaurus(emojiObj = {}, query = '') {
    const { keywords } = emojiObj;
    const thesaurus = flatten(emojiObj.thesaurus);
    return minPrefixOverlapsByWordSet(query)([keywords, thesaurus]);
  }



  return {
    __id__: 'emoji',
    // Key data method
    search: searchOn(array),
    // UI Methods
    render,
    onPressEmoji,
    copyToClipboard,
    copyFirstEmoji,
    moveFocusX,
    moveFocusY,
    closePopup,
    // re-exports
    toCodePoints,
    fromCodePoints,
    // Exported for test only:
    matchKeywordsAndThesaurus,
    matchStrengthFor,
    htmlForAllEmoji,
    searchOn,
  }
})();
