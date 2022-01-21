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

// This script updates the emojilib dependency data

const fs = require('fs')
const https = require('https')
const files = {
  // keyword lists for emoji
  'third_party/emojilib/emoji-en-US.json': `https://raw.githubusercontent.com/muan/emojilib/main/dist/emoji-en-US.json`,
  // Plain unicode data for emoji
  'third_party/emojilib/data-by-emoji.json': `https://raw.githubusercontent.com/muan/unicode-emoji-json/main/data-by-emoji.json`,
}

// to parse the file inside https.get()...
//
// const emojilib = require('../third_party/emojilib/emojilib');
// const nBefore = Object.entries(emojilib).length;
// var json = '';
// res.on('data', function (chunk) {
//     json += chunk;
// });
// res.on('end', function () {
//     if (res.statusCode === 200) {
//         try {
//             var data = JSON.parse(json);
//             const nAfter = Object.entries(data).length;
//             console.log(`Before: ${nBefore}`);
//             console.log(`After:  ${nAfter} (${nAfter - nBefore} new ones)`);
//         } catch (e) {
//             console.log('Error parsing JSON!');
//         }
//     } else {
//         console.log('Status:', res.statusCode);
//     }
// });

for (const name of Object.keys(files)) {
  const file = fs.createWriteStream(name)
  https.get(files[name], function(res) {
    res.pipe(file);
  })
}