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
const emojilib = require('../../third_party/emojilib/emojilib');



module.exports = ((global) => {

  // Skip emojis with these names
  const SKIP = ['__id__'];

  const array = Object.entries(emojilib)
    .map(([name, obj]) => ({name, ...obj}))
    .filter(({name}) => !SKIP.includes(name));
  
  // Utility functions
  // Convert from an array of emoji objects to a plain char
  const toChars = (arr = []) => arr.map(o => o.char);

  // TODO: mix in thesaurus data
  // TODO: mix in wordmap relationship data








  return {
    toChars,
    array,
    __id__: 'emoji_data', // emulated node modules
  };
})(this);