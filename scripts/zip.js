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

const fs = require('fs');
const child_process = require("child_process");

const zipFile = './dist/emoji-magic.zip';

try {
  fs.unlinkSync(zipFile); // rm if already there
} catch (err) {
  // it's fine if the file doesn't exist
}

// bring over only the good stuff
const includes = [
  'manifest.json',
  'icons/*.png',
  'src/*/*.js',
  'src/*/*.css',
  'src/*/*.html',
  '_locales',
  'third_party/emojilib/emojilib.js',
];

child_process.execSync(`zip -r ${zipFile} ${includes.join(' ')}`, {
  cwd: '.'
});