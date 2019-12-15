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

const child_process = require("child_process");

const dest = './docs';
const cwd = '.';

// remove it
child_process.execSync(`rm -rf ${dest}`, {cwd});

// put things in place
child_process.execSync(`mkdir -p ${dest}/icons`, {cwd});
child_process.execSync(`cp -r ./src/** ${dest}/`, {cwd});
child_process.execSync(`cp ./icons/favicon* ${dest}/icons/`, {cwd});

toRemove = [
  `${dest}/browser_action.html`,
  `${dest}/bind_to_dom.js`,
  `${dest}/**/*.sass`,
  `${dest}/**/*.css.map`,
  `${dest}/**/*.test.js`,
];

// rm nonessential things
child_process.execSync(`rm ${toRemove.join(' ')}`, {cwd});