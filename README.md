# Emoji Magic

> Find Emoji using keywords.

![gif in action](./screenshots/2019 08-18 emoji-magic.gif?raw=true)

Inspired by the ease of use from mojibar.

Born of a desire to improve emoji searching even further.

## Design

Two steps: matching and ranking.

### Matching

1. break search into tokens
2. prefix match each token

### Ranking

?

## TODO

### Basic Functionality

- [x] basic, functional styling
- [x] list emojis from a data source
- [x] put on github
- [x] filter emoji (basic)
- [x] append to a "clipboard" area
- [x] can copy to clipboard
- [x] "copied" notification / animation
- [x] clicking emojis copies them to clipboard

### Power User Features

- [x] Hitting enter right after a query works
- [x] Arrow keys work (up, down, left, right)

### Advanced Functionality

- [ ] skin tone setting

### Platform Render Quirks

- [ ] detect which emoji the user's current platform can render (big user pain point)
- [ ] if cannot render, don't suggest it unless it's the only option(s). provide explanation.

### Searching, suggesting

- [ ] support multi-token matching (eg: "red car" and "green heart")
- [ ] store the last k emoji the user copied (to fill in recently used)
- [ ] enhanced findability: identify color(s). eg: purple
- [ ] enhanced findability: store user behavior
- [ ] enhanced findability: add stored user behavior to keywords / revamp match+rank algo

### Marketing

- [ ] emoji count (for marketing)
- [ ] beautiful gif (queries: wave, blue, tree, hat)


## emoji app investigation

Other extensions want to "read and change the data on all the sites you visit".

This is incredibly unsafe.

> Pitch: My extension only needs clipboard access to make it easy for you to add emoji wherever you want.

- [x] evaluate joypixels, top chrome extension

```
searches for "cat" don't even have cats on screen
"happy" has odd symbols as the first few results
"party" is much better.
Seems to get very good broad results, but have poor sorting.
nice: persistent skin tone setting
nice: every click adds an emoji to a visible "clipboard" area, as well as copying.
poor: slow performance
unclear: unknown emoji
  flag uses joypixels emoji in the ui. pastes into messenger as facebook emoji
  my text editor shows two symbols
  apple textedit supports it
```

## Thanks and Credits

* Extension boilerplate from [extensionizr](extensionizr.com).
* Logo from [twemoji](https://github.com/twitter/twemoji).
* Initial data source from [emojilib](https://github.com/muan/emojilib).
* animation from [@danden's animate.css](https://github.com/daneden/animate.css).