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

const emoji_data = require('./emoji_data');
const store = require('../js_utils/store');
const emoji = require('./emoji');
const emojilib = require('../../third_party/emojilib/emojilib');




// A global storing all the tests to run for this application
// window = global || window; // work for node or browser
// const unit_tests = global.unit_tests || [];
// window.unit_tests.push(function emojiTest() {
const unitTest = (function emojiTest() {


  // -------------------------------------------- Setup
  console.assert(emoji_data != null, "emojiData is defined");
  console.assert(store != null, "store is defined");
  console.assert(emoji != null, "emoji is defined");
  console.assert(emojilib != null, "emojilib is defined");
  
  
  
  // -------------------------------------------- Validate Data
  console.assert(emoji_data.array.length > 1500, "there are more than 1500 emojilib_thesaurus emojis", emoji_data.array.length);

  // -------------------------------------------- Describe `filter`
  let result;

  result = emoji.search('crystal');
  // WARNING: if you check length on the string result, you'll probably see 4, not 2, because many emoji are double-byte chars.
  console.assert(result.length === 2, "searching for 'crystal' returns 2 results", result);
  console.assert(result.includes('🔮'), "filter 'crystal' returns a crystal ball", result);
  console.assert(result.includes('💠'), "filter 'crystal' returns quartet of diamonds", result);
  
  result = emoji.search('pepper');
  console.assert(result.length === 1, "searching for 'pepper' returns 1 emoji", result);
  console.assert(result[0] === '🌶', "searching for 'pepper' returns the pepper emoji", result);

  // tests I'd like to pass:
  assertFilterIncludes('green', '💚');
  


  // -------------------------------------------- Multi-word searches
  assertFilterIs('blue heart', '💙');
  assertFilterIs('  heart    blue ', '💙'); // funny spacing
  assertFilterIs('green ball', '🎾');
  assertFilterIs('sad cat', '😿');



  // -------------------------------------------- Thesaurized searches
  assertFilterIncludes('visage', '😀', {useThesaurus: true});
  assertFilterIncludes('ice', '🥶', {useThesaurus: true});
  
  // Doesn't work, but maybe should:
  // assertFilterIncludes('angry', '🤬',  {useThesaurus: true});
  
  // Test obvious synonyms
  assertFilterIncludes('sick', '🤮'); // this is the human entered, "canonical" keyword
  assertFilterIncludes('barf', '🤮', {useThesaurus: true});
  assertFilterIncludes('puke', '🤮', {useThesaurus: true});



  // -------------------------------------------- Reverse search. Do we see expected keywords and synonyms for a symbol?
  const sickEmoji = emoji_data.toObj('🤮');
  console.assert(sickEmoji.keywords.length >= 2, `'🤮' has some keywords`, sickEmoji);
  const sickThesaurus = flatten(sickEmoji.thesaurus)
  console.assert(sickThesaurus.length >= 100, `'🤮' has >= 100 thesaurus entries`, sickThesaurus.length);
  const hasAll = ['afflicted','seasick','dizzy','unwell'].every(s => sickThesaurus.includes(s))
  console.assert(hasAll, `'🤮' has all synonyms you'd expect`, sickThesaurus);
  


  function assertFilterIncludes(needle, has, opts) {
    let result = emoji.search(needle, opts);
    console.assert(result.includes(has), `Searching for '${needle}' includes '${has}'`, result); 
  }

  function assertFilterIs(needle, target, opts) {
    let result = emoji.search(needle, opts);
    console.assert(result.length === 1, `Searching for '${needle}' has only 1 result`, result); 
    console.assert(result[0] === target, `Searching for '${needle}' returns '${target}'`, result); 
  }

  function flatten(arr) {
    return arr.reduce((acc, val) => acc.concat(val), []);
  }

});



unitTest(); // TODO: do this execution on the node/runner side
