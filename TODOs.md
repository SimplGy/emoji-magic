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

- [ ] Add better tooltips for emoji (canonical name, unicode char, how it matched your search query, other fun facts?)
- [ ] Periodically clear the "multi emoji copy" buffer (otherwise it hangs around forever)

### Power User Features

- [x] Hitting enter right after a query works
- [x] Arrow keys work (up, down, left, right)

### Tech Debt

- [x] Basic unit tests (when search for A, expect set B)
- [ ] Support multiple `.test.js` files (right now the "runner" command is in the only test file)
- [ ] Don't ship the tests with the app bundle

### Bugs

- [ ] Searching for only the letter "d" shows "undefined" in the emoji list, which is weird.

### Gloss & Packaging

- [x] create zip file (script)
- [x] Write short store description
- [x] 280x800 or 640x400 screenshots
- [x] Make Chrome extension available
- [x] promo tile images
- [x] Youtube video demo (from gif)
- [ ] Youtube video demo (better/show extension icon context)
- [ ] Collect more/better screenshots
- [ ] get that "runs offline" checkmark -- https://developer.chrome.com/apps/manifest/offline_enabled

### Advanced Functionality

- [ ] skin tone setting
- [ ] mini game: "what do most people call this emoji?" (data source for search keywords)

### Platform Render Quirks

- [ ] detect which emoji the user's current platform can render (big user pain point)
- [ ] if cannot render, don't suggest it unless it's the only option(s). provide explanation.

### Searching, suggesting

- [x] Show recently used emoji when the user hasn't searched yet
- [x] support multi-token matching (eg: "red car" and "green heart")
- [ ] Use thesaurus to extend hand-written keywords
- [ ] full word matches are more significant than partial word matches (eg: "car" matches many things partially, putting actual cars low on the list)
