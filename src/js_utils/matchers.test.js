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

const {prefixOverlap} = require('./matchers');



describe("matchers", () => {
  describe("prefixOverlap", () => {
    
    it('sees matches', () => {
      const result = prefixOverlap('foo')('foobar');
      expect(result).toBeGreaterThan(0);
    });

    it('only matches prefixes', () => {
      expect(prefixOverlap('a')('ab')).toBeGreaterThan(0);
      expect(prefixOverlap('b')('ab')).toBe(0);
    });
    
    it('does not match a blank keyword', () => {
      expect(prefixOverlap('')('foo')).toBe(0);
    });
    
    it('calculates expected prefix ratios', () => {
      expect(prefixOverlap('f')('farm')).toBe(0.25);
      expect(prefixOverlap('fa')('farm')).toBe(0.50);
      expect(prefixOverlap('far')('farm')).toBe(0.75);
      expect(prefixOverlap('farm')('farm')).toBe(1);

    });
    
  });
});
