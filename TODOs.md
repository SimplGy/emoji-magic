# TODOs

### Basic Functionality

- [x] basic, functional styling
- [x] list emojis from a data source
- [x] put on github
- [x] filter emoji (basic)
- [x] append to a "clipboard" area
- [x] can copy to clipboard
- [x] "copied" notification / animation
- [x] clicking emojis copies them to clipboard

### Nice Touches

- [x] Add a basic tooltip for emoji (canonical name, keywords, thesaurus words)
- [x] have an emoji details page (for the demo site, and maybe some way to get to from Chrome)
- [x] Periodically clear the "multi emoji copy" DOM buffer (otherwise it hangs around forever)
- [x] limit emoji count to what fits in chrome's 600px tall browser popup limit
- [x] only match startsWith, because "ice" shouldn't match "office worker"
- [ ] Emoji tooltip that shows why it matched your search query, unicode values, etc.
- [x] support thesaurus matches, but group/sort results so the increased quantity of matches isn't annoying -- implemented a new sorting system
- [ ] Introduct a clear separation between "strong matches" and "far away matches". Some of the thesaurus matches are quite a stretch.
- [ ] Work on performance. The new search+sort has taken a toll, I think.
  - [ ] use a trie for `startsWith` matching 
  - [ ] optimization: when the user is only adding chars, reduce the current result set, instead of always starting from the full data set
  - [ ] Preconstruct the emoji object to have the match/matchVector field so that the VM can optimize the object shape as stable

### Power User Features

- [x] Hitting enter right after a query works
- [x] Arrow keys work (up, down, left, right)
- [x] Hitting escape when in a blank search box closes the popup
- [ ] Find the emoji that is most like [this word]. Tell the search engine to crawl some graph as far as possible until it finds at least some kind of result, even if it wouldn't otherwise.
  - use case: "Pikachu". Obviously not an emoji, but maybe the world's greatest emoji search engine would find "lighting bolt" and "mouse"?

### Tech Debt / Dev Chores

- [ ] Use TypeScript for a clear definition of the Emoji data object type
- [ ] make `scripts/zip.js` do a clean before it works. Also have it copy things to a folder, then zip that folder. (enables "excludes")
  - [ ] Don't ship the tests with the app bundle
- [x] Support multiple `.test.js` files (right now the "runner" command is in the only test file)
  - [x] Use `jasmine` for tests
    - [x] ~~Update npm so that `**/*.test.js` pattern matching can work~~
    - [x] ~~Update nvm so that I can update npm -- `node -v` should match `npm run node -v`~~
    - [x] ~~Use a local dep to match the npm triggered node to my dev env -- `npm i node@11.8.0 --save-exact --save-dev`~~
    - [x] Use `jasmine` instead of `jasmine-node`. the latter is deprecated and maybe had something wrong with the npm versioning.
- [x] support multiple tests
- [x] Basic unit tests (when search for A, expect set B)
- [x] Do the "copied" animation without the animate.css dependency
- [x] stop the `favicon.ico` browser error

### Bugs

- [x] arrow keys do unexpected things when working with text selections in search -- only leave search for the down arrow key (and tab, of course)
- [x] Searching for only the letter "d" shows "undefined" in the emoji list, which is weird. (root cause: matching `__id__`)
- [x] Only close the window after picking an emoji in the browser popup context
- [ ] if you press enter to copy the default emoji from an empty search, it doesn't clear the input clipboard

### Gloss & Packaging

- [x] create zip file (script)
- [x] Write short store description
- [x] 280x800 or 640x400 screenshots
- [x] Make Chrome extension available
- [x] promo tile images
- [x] Youtube video demo (from gif)
- [x] Deploy a demo version as a simple web app with a link to the Chrome store -- simple.gy/emoji-magic
- [ ] Youtube video demo (better/show extension icon context)
- [ ] Collect more/better screenshots
- [x] get that "runs offline" checkmark -- https://developer.chrome.com/apps/manifest/offline_enabled

### Advanced Functionality

- [ ] skin tone setting
- [ ] mini game: "what's the most best name for this emoji?" (data source for search keywords) use family-feud style scoring

### Platform Render Quirks

- [ ] detect which emoji the user's current platform can render (big user pain/confusion point for users in the reviews of other emoji apps)
- [ ] if cannot render, don't suggest it unless it's the only option(s). provide explanation.

### Searching, suggesting

- [x] Show recently used emoji when the user hasn't searched yet
- [x] support multi-token matching (eg: "red car" and "green heart")
- [x] Use thesaurus to extend hand-written keywords
- [ ] Improve sorting with a scoring criteria. Factors: full/partial match. name/keyword/thesaurus match.
  - full word matches are more significant than partial word matches (eg: "car" matches many things partially, putting actual cars low on the list)
- [ ] Add urban dictionary style data (use case: "ice" -> "💎")
- [ ] Add a way to contribute more seed/human keywords (use case: "mad"/"angry" -> "🤬")
- [ ] Mix in canonical names/values from https://www.utf8-chartable.de/unicode-utf8-table.pl?start=128000