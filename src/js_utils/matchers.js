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


module.exports = (() => {

  // Given a pair of strings, how much does the `keyword` prefix the `candidate`?
  // eg: "foo", "foobar" -> 0.50 prefix
  // eg: "b",   "bake"   -> 0.25 prefix
  // Returns a number between 0 and 1, representing the overlap ratio
  const prefixOverlap = (term = '') => (candidate = '') => {
    if (term.length === 0 || candidate.lenth === 0) return 0;

    if(candidate.startsWith(term)) {
      return term.length / candidate.length;
    }

    return 0;
  };

  // Given a string, then an array of strings, return the maxPrefixOverlap
  // Returns a number between 0 and 1, representing the overlap ratio
  const maxPrefixOverlap = (term = '') => (candidates = []) => {
    if (term.length === 0 || candidates.lenth === 0) return 0;

    const weights = candidates.map(prefixOverlap(term));
    return Math.max.apply(Math, weights);
  };

  // Given a string, then a string[][], calculate the maxPrefixOverlap for each candidate array
  // Returns an array of numbers between 0 and 1, one number for each element in arr.
  const calcPrefixOverlaps = (term) => (arr = []) => {
    return arr.map(maxPrefixOverlap(term));
  };


  return {
    prefixOverlap,
    maxPrefixOverlap,
    calcPrefixOverlaps,
    __id__: 'matchers',
  }
})();
