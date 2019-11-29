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



module.exports = ((global) => {
  
  // return a string of rendered html for the given emoji
  function render(emoji) {
    const { keywords = [], thesaurus = [] } = emoji;

    return `
    <h1>${emoji.char} ${emoji.name}</h1>
    <p>
      ${ keywords.join(', ') }
    </p>
    
    <dl>
      ${
        thesaurus
          .filter(arr => arr.length > 0)
          .map((arr, idx) => `
            <dt>${keywords[idx]}</dt>
            <dd>${arr.join(', ')}</dd>
          `)
          .join('\n')
      }
    </dl>
    `;
  }

  return {
    render,
    __id__: 'emoji_details', // emulated node modules
  };
})(this);