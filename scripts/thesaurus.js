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

// This script reads in emoji data
// For each emoji, it looks up thesaurus information and mixes it in
// It then writes this to a file called `emojilib_thesaurus.js`
// That file is the main data source used by this application

const moby = require('moby') // many results
const thesaurus = require("thesaurus"); // consice results
const fs = require('fs');
const child_process = require("child_process");

const emoji_keywords_json = require('../third_party/emojilib/emoji-en-US.json');
const data_by_emoji_json = require('../third_party/emojilib/data-by-emoji.json');



// ---------------------------------------------- Config
// Manually, add additional keywords to certain emoji
MANUAL_KEYWORDS = {
  '🤬': ['angry'],
}


// ---------------------------------------------- Data Format (explanation)
/*
Input format, `data-by-emoji.json`:
```
{
  "💯": {
    "name": "hundred points",
    "slug": "hundred_points",
    "group": "Smileys & Emotion",
    "emoji_version": "0.6",
    "unicode_version": "0.6",
    "skin_tone_support": false
  },
}
```


Input format, `emoji-en-US.json` (emojilib keywords):
```
{
  "💯": [
    "hundred_points",
    "score",
    "perfect",
    "numbers",
    "century",
    "exam",
    "quiz",
    "test",
    "pass",
    "hundred"
  ],
}
```


Output format, `emojilib_thesaurus.js` (array):
```
[
  {
    "keywords": [
      "100", // "name" was mixed into the keywords first so thesaurus would generate for it
      "score",
      "perfect",
    ],
    "char": "💯",
    "category": "symbols",
    "name": "100",
    // generated for each keyword
    "thesaurus": [
      [
        "hundred",
        "a hundred",
        "one hundred",
      ],
      [
        "mark",
        "grade",
        "evaluation",
      ],
      [
        "perfect",
        "clean",
        "clear",
        "cold",
      ],
    ]
  }
]
```

*/
// ---------------------------------------------- Procedure
// Make sure the folder exists
const DIR = 'src/app_data';
child_process.execSync(`mkdir -p ${DIR}`, {cwd: '.'});

// Summarize our data set
const a = Object.keys(data_by_emoji_json);
const b = Object.keys(emoji_keywords_json);
console.log(`found ${a.length} emoji in data_by_emoji_json`);
console.log(`found ${b.length} emoji in emoji_keywords_json`);
const allKeys = Array.from(new Set([...a, ...b]));
console.log(`${allKeys.length} total unique emoji`);
console.log();

// Zip the data into a simple array
const rawEmojiArray = allKeys.map(char => {
  // this is metadata like name/slug/unicode_version
  const data = data_by_emoji_json[char];
  const nameParts = data.name.split(' ').map(s => s.trim()); // 'foo bar' -> ['foo', 'bar']
  // emojilib/emoji-en-US.json includes the "slugified_name" of the emoji. Leave it there for advanced match/debug use cases.
  let keywords = emoji_keywords_json[char] || [];
  // add in keywords defined by this project
  const manualKeywords = MANUAL_KEYWORDS[char] || [];
  keywords = [...keywords, ...manualKeywords];
  // remove exact matches from keywords that are also in names (prevent double counting)
  keywords = keywords.filter(k => !nameParts.includes(k));

  return {
    char,
    nameParts,  
    keywords,
    ...data,
  };
});

// Add in thesaurus data
const thesaurized = rawEmojiArray.map(withThesaurus);
// Alternative thesaurus: `moby`. Creates a 19 MB file, let's not do this one yet/this way:
// const thesaurized = emoji_data.array.map(withMoby);

// Write the file to disk
fs.writeFileSync(`${DIR}/emojilib_thesaurus.js`, buildFile(thesaurized));



// ---------------------------------------------- Util
/*
Input object example:
{
  name: '100',
  char: '💯',
  category: 'symbols',
  keywords:[ 'score', 'perfect', 'hundred' ]
}
*/

function withThesaurus(emojiObj) {
  const { keywords = [], nameParts = [] } = emojiObj;
  const allWords = [...keywords, ...nameParts];
  if (keywords.length === 0) console.warn(`\nno keywords for emoji:`, emojiObj);
  const related = allWords.map(word => thesaurus.find(word))
  return {
    ...emojiObj,
    thesaurus: related,
  }
}

function withMoby(emojiObj) {
  const { keywords = [], nameParts = [] } = emojiObj;
  const allWords = [...keywords, ...nameParts];
  if (keywords.length === 0) console.warn(`\nno keywords for emoji:`, emojiObj);
  const related = allWords.map(word => moby.search(word))
  return {
    ...emojiObj,
    thesaurus: related,
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
  __id__: 'emojilib_thesaurus',
  array: [
    ${arr.map(toPrintable).join(',\n')}
  ],
};
`
}

function toPrintable(o) {
  return JSON.stringify(o, null, 2)
}
