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
const moby = require('moby') // many results
const thesaurus = require("thesaurus"); // consice results
const fs = require('fs');
const child_process = require("child_process");

const emoji_data = require('../src/browser_action/emoji_data')



// ---------------------------------------------- Procedure
// Make sure the folder exists
const DIR = 'src/browser_action/data'
child_process.execSync(`mkdir -p ${DIR}`, {cwd: '.'})

// Calculate contents and write the files
const thesaurized = emoji_data.array.map(withThesaurus)
fs.writeFileSync(`${DIR}/emojilib_thesaurus.js`, buildFile(thesaurized))

// This creates a 19 MB file, let's not do this one yet/this way.
// const mobyized = emoji_data.array.map(withMoby)
// fs.writeFileSync(`${DIR}/emojilib_moby.js`, buildFile(mobyized))



// ---------------------------------------------- Util
/*
Input object example:
{
  name: '100',
  char: '💯',
  fitzpatrick_scale: false,
  category: 'symbols',
  keywords:[ 'score', 'perfect', 'hundred' ]
}
*/

function withThesaurus(emojiObj) {
  const { keywords = [] } = emojiObj;
  if (keywords.length === 0) console.warn(`no keywords for emoji:`, emojiObj);
  const thesaurized = keywords.map(word => thesaurus.find(word))
  return {
    ...emojiObj,
    thesaurized,
  }
}

function withMoby(emojiObj) {
  const { keywords = [] } = emojiObj;
  if (keywords.length === 0) console.warn(`no keywords for emoji:`, emojiObj);
  const thesaurized = keywords.map(word => moby.search(word))
  return {
    ...emojiObj,
    thesaurized,
  }
}

function buildFile(arr = []) {
  return `
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

module.exports = {
  __id__: 'emojilib_decorated',
  array: [
    ${arr.map(toPrintable).join(',\n')}
  ],
};
`
}

function toPrintable(o) {
  return JSON.stringify(o, null, 2)
}
