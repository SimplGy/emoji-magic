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

// This script copies the right content to the `docs/` folder, which is where GitHub Pages expects static content to live.
// https://github.blog/2016-08-22-publish-your-project-documentation-with-github-pages/

const child_process = require("child_process");

const dest = './docs';
const cwd = '.';

// remove it
child_process.execSync(`rm -rf ${dest}`, {cwd});

// put things in place
child_process.execSync(`mkdir -p ${dest}/icons`, {cwd});
child_process.execSync(`cp -r ./src/** ${dest}/`, {cwd});

// reset icons
child_process.execSync(`rm -rf ${dest}/icons`, {cwd});
child_process.execSync(`mkdir -p ${dest}/icons`, {cwd});
child_process.execSync(`cp ./src/icons/favicon-32x32.png ${dest}/icons/`, {cwd});

toRemove = [
  `${dest}/browser_action.html`,
  `${dest}/**/*.sass`,
  `${dest}/**/*.css.map`,
  `${dest}/**/*.test.js`,
  `${dest}/**/*.sketch`,
];

// rm nonessential things
child_process.execSync(`rm -rf ${toRemove.join(' ')}`, {cwd});