# Emoji Magic

> Find Emoji using keywords.

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

- [x] basic, functional styling
- [x] list emojis from a data source
- [x] put on github
- [ ] filter emoji (basic)
- [ ] hitting enter copies to clipboard
- [ ] clicking copies to clipboard
- [ ] "copied" notification / animation
- [ ] append to a "clipboard" area
- [ ] skin tone setting
- [ ] store the last k emoji the user copied (to fill in recently used)
- [ ] 
- [ ] detect which emoji the user's current platform can render (big user pain point)
- [ ] if cannot render, don't suggest it unless it's the only option(s). provide explanation.
- [ ] 
- [ ] 
- [ ] emoji count (for marketing)
- [ ] 
- [ ] enhanced findability: identify color(s). eg: purple
- [ ] enhanced findability: store user behavior

## Thanks and Citations

* Extension boilerplate from [extensionizr](extensionizr.com).
* Product logo from [twemoji](https://github.com/twitter/twemoji).

## emoji data source investigation

* https://github.com/muan/emojilib -- keywords and data about emoji

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