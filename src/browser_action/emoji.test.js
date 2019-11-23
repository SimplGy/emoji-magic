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

const store = require('./store');
const emoji = require('./emoji');
const emojilib = require('../../third_party/emojilib/emojilib');




// A global storing all the tests to run for this application
// window = global || window; // work for node or browser
// const unit_tests = global.unit_tests || [];
// window.unit_tests.push(function emojiTest() {
const unitTest = (function emojiTest() {


  // -------------------------------------------- Setup
  // const {store, emoji, emojilib} = window;
  
  console.assert(store != null, "store is defined");
  console.assert(emoji != null, "emoji is defined");
  console.assert(emojilib != null, "emojilib is defined");
  
  // Stubs
  // window.document = window.document || {
  //   getElementById: () => {},
  // };
  
  
  
  // -------------------------------------------- Data
  // todo: put data transforms in the app layer, not the run layer
  const data = Object.entries(emojilib).map(([name, obj]) => ({name, ...obj})); // copied from run.js
  console.assert(data.length > 1500, "there are more than 1500 emojis", data.length);
  const filterWith = emoji.filter(
    data,
    true, // skipRender
  );
  let result;
    


  // -------------------------------------------- Describe `filter`
  
  result = filterWith('crystal');
  // WARNING: if you check length on the string result, you'll probably see 4, not 2, because many emoji are double-byte chars.
  console.assert(result.length === 2, "searching for 'crystal' returns 2 results", result);
  console.assert(result.includes('🔮'), "filter 'crystal' returns a crystal ball", result);
  console.assert(result.includes('💠'), "filter 'crystal' returns quartet of diamonds", result);
  
  result = filterWith('pepper');
  // WARNING: if you check length on the string result, you'll probably see 4, not 2, because many emoji are double-byte chars.
  console.assert(result.length === 1, "searching for 'pepper' returns 1 emoji", result);
  console.assert(result[0] === '🌶', "searching for 'pepper' returns the pepper emoji", result);

});



unitTest(); // TODO: do this execution on the node/runner side
