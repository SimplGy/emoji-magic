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

// This script is to show the current version of unicode supported by the app
// It also prints a graph of unicode version distribution, for fun

/*
Intended use:

$ node scripts/show-unicode-versions

Distribution of emojis in each unicode_version:
13.1  ███████
13.0  ███████████████████████████████████████████████████████████████████
12.1  ███████████████████████
12.0  ███████████████████████████████████████████████████████████████████████████
11.0  █████████████████████████████████████████████████████████████████████████████
5.0   ███████████████████████████████████████████████████████████████████████████████

Emojis by unicode_version:
13.1
😶‍🌫️ 😮‍💨 😵‍💫 ❤️‍🔥 ❤️‍🩹 🧔‍♂️ 🧔‍♀️
13.0
🥲 🥸 🤌 🫀 🫁 🥷 🤵‍♂️ 🤵‍♀️ 👰‍♂️ 👰‍♀️ 👩‍🍼 👨‍🍼 🧑‍🍼 🧑‍🎄 🫂 🐈‍⬛ 🦬 🦣 🦫 🐻‍❄️ 🦤 🪶 🦭 🪲 🪳 🪰 🪱 🪴 🫐 🫒 🫑 🫓 🫔 🫕 🫖 🧋 🪨 🪵 🛖 🛻 🛼 🪄 🪅 🪆 🪡 🪢 🩴 🪖 🪗 🪘 🪙 🪃 🪚 🪛 🪝 🪜 🛗 🪞 🪟 🪠 🪤 🪣 🪥 🪦 🪧 ⚧️ 🏳️‍⚧️
12.1
🧑‍🦰 🧑‍🦱 🧑‍🦳 🧑‍🦲 🧑‍⚕️ 🧑‍🎓 🧑‍🏫 🧑‍⚖️ 🧑‍🌾 🧑‍🍳 🧑‍🔧 🧑‍🏭 🧑‍💼 🧑‍🔬 🧑‍💻 🧑‍🎤 🧑‍🎨 🧑‍✈️ 🧑‍🚀 🧑‍🚒 🧑‍🦯 🧑‍🦼 🧑‍🦽

*/

const emojilib_thesaurus = require('../src/app_data/emojilib_thesaurus').array;

let grouped_data = groupBy(emojilib_thesaurus, 'unicode_version');


// Display Output
const sortedEntries = Object.entries(grouped_data).sort(([a], [b]) => Number(b) - Number(a));

console.log("Emojis by unicode_version:");
console.log();
for (const [unicode_version, emojis] of sortedEntries) {
    if (Number(unicode_version) < 1) continue;
    console.log(unicode_version);
    console.log(emojis.map(e => e.char).join(' '));
    console.log();
}

console.log();
console.log();

console.log("Distribution of emojis in each unicode_version:");
for (const [unicode_version, emojis] of sortedEntries) {
    const v = unicode_version.padEnd(6);
    const n = `(${emojis.length})`.padEnd(5);
    const bar = emojis.map(e => '█').join('');
    console.log(`${v} ${n} ${bar}`);
}










// ---------------------------------------- Pure function lib
function groupBy(arr, propertyName) {
    const output = {}
    arr.forEach(o => {
        const key = o[propertyName];
        output[key] = output[key] ?? [];
        output[key].push(o);
    });
    return output
}