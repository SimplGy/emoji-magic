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

const {array, toChars, toObj} = require('./emoji_data');
const store = require('../js_utils/store');
const emoji = require('./emoji');
const emojilib = require('../../third_party/emojilib/emojilib');

function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}



describe("emoji.js", () => {

  // shorthand for doing an emoji search and converting the results to chars instead of objects
  s = (term, opts) => toChars(emoji.search(term, opts));

  // expect that a term includes emojiChar somewhere in results
  expectSearchIncludes = (term, emojiChar, opts) => {
    let result = s(term, opts);
    expect(result).toContain(emojiChar);
  };

  // expect that the top ranked result for a term is emojiChar
  expectFirstResult = (term, emojiChar, opts) => {
    const result = s(term, opts);
    expect(result[0]).toBe(emojiChar);
  };

  describe("setup", () => {
    it("has prerequisites defined", () => {
      expect(store).toBeDefined();
      expect(emoji).toBeDefined();
      expect(emojilib).toBeDefined();
    });
    it("has more than 1500 emojilib_thesaurus emojis", () => {
      expect(array.length).toBeGreaterThan(1500);
    });
  });
  
  
  describe("emoji.search()", () => {
    it("matches epected symbols for 'crystal'", () => {
      const result = s('crystal');
      // WARNING: if you check length on a joined string result instead of this array, you'll probably see 4, not 2, because many emoji are multi-byte chars.
      expect(result.length).toBe(2);
      expect(result).toContain('🔮');
      expect(result).toContain('💠');
    });

    it("matches epected symbols for 'pepper'", () => {
      expectFirstResult('pepper', '🌶');
    });

    it("matches other simple searches", () => {
      expect(s('green')).toContain('💚');
    });

    it("handles multi-word searches", () => {
      expectFirstResult('blue heart', '💙');
      expectFirstResult('  heart    blue ', '💙'); // funny spacing
      expectFirstResult('green ball', '🎾');
      expectFirstResult('sad cat', '😿');
    });

    it("only matches prefixes", () => {
      const result = s('ice');
      expect(result).not.toContain('👨‍💼'); // Shouldn't match "off[ice] worker"
    });

    it("matches some common prefixes", () => {
      const result = s('fire');
      expect(result).toContain('🔥'); // fire
      expect(result).toContain('🚒'); // fire_engine
      expect(result).toContain('👩‍🚒'); // woman_firefighter
    });

    it("matches prefixes in multi_word emoji names", () => {
      const emojiObj = toObj('🍧');
      expect(emojiObj.name).toBe('shaved_ice');

      // even though it doesn't startWith "ice", because it's in the name, it matches
      expectSearchIncludes('ice', '🍧')
    });

    it("does't just blindly match anywhere in multi_word emoji names", () => {
      const emojiObj = toObj('🍧');
      expect(emojiObj.name).toBe('shaved_ice');

      // even though it doesn't startWith "ice", because it's in the name, it matches
      expect(s('have')).not.toContain('🍧') // "have" does not match "shaved"
    });
  });



  describe("Thesaurus Matching", () => {
    
    it("finds things using thesaurus it otherwise wouldn't", () => {
      expectSearchIncludes('visage', '😀', {useThesaurus: true});
      expectSearchIncludes('ice', '🥶', {useThesaurus: true});
      // Doesn't work, but maybe should:
      // assertFilterIncludes('angry', '🤬',  {useThesaurus: true});
    });
    
    it("finds synonyms for 'barf'", () => {
      expectSearchIncludes('sick', '🤮'); // this is the human entered, "canonical" keyword
      expectSearchIncludes('barf', '🤮', {useThesaurus: true});
      expectSearchIncludes('puke', '🤮', {useThesaurus: true});
    });
  });





  // -------------------------------------------- Reverse search. Do we see expected keywords and synonyms for a symbol?
  describe("Emoji Objects", () => {
    const sickEmoji = toObj('🤮');
    it('has keywords', () => {
      expect(sickEmoji.keywords.length).toBeGreaterThanOrEqual(2); // '🤮' has some keywords
    });
    it('has a reasonable looking thesaurus', () => {
      const sickThesaurus = flatten(sickEmoji.thesaurus);
      expect(sickThesaurus.length).toBeGreaterThan(100);
      // Has expected synonyms
      expect(sickThesaurus).toEqual(jasmine.arrayContaining(['afflicted','seasick','dizzy','unwell']));
      // And not ones you wouldn't
      expect(sickThesaurus).not.toEqual(jasmine.arrayContaining(['giraffe','elephant']));
    });
  });
  
  
  




});
