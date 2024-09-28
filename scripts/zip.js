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

// This script copies over a bunch of files and puts them in a zip file in dist/
// dist/ is gitignored so it won't show in source control or commits

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
  'src/icons/*.png',
  'src/browser_action.html',
  'src/*.js',
  'src/*/*.css',
  'src/*/*.js',
  '_locales',
  'third_party/emojilib/emojilib.js',
  'third_party/animate.min.css',
];

child_process.execSync(`zip -r ${zipFile} ${includes.join(' ')}`, {
  cwd: '.'
});