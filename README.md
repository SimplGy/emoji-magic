# Emoji Magic

> Find Emoji using keywords.

![gif in action](./screenshots/demo.gif?raw=true)

Inspired by the ease of use of [mojibar](https://github.com/muan/mojibar).

Born of a desire to improve emoji searching even further.

## How to Use

1. Click the extension icon: `🔮`
2. Type in what you want, like "cat"
3. Hit "enter" or click on the exact emoji you want

> Tip: choose a keyboard shortcut in [chrome://extensions/shortcuts](chrome://extensions/shortcuts) -> `Emoji Magic` so you can add Emojis easily, anytime.

## Features

1. 🔧 Actual Unicode Chars -- Native emoji rendering, no big slow images
2. 📘 Rich Text Matching -- Finds synonyms using a thesaurus
3. 🔗 Multi-word Queries -- Try "sad cat", or "blue heart"
4. 🧠 Remembers locally -- Saves the last emoji you picked so you can pick them again easily
5. 🔒 Strong security -- No dangerous Chrome permissions, just clipboard access

## Extension Security

This app requires absolutely minimal permissions.

1. Only clipboard access
1. No background script

Other emoji extensions I've seen want to "read and change the data on all the sites you visit".

These permissions are unsafe, and not necessary for a emoji picker. Read more: [1], [2], [3]

## Developing

Serve the local repo for live editing and a fast dev experience:

```
# run in repo root:
serve -l 8080
# or:
python3 -m http.server 8080 

# To view the demo version of the app with a "website" wrapper:
# http://0.0.0.0:8080/src/

# To view the "details" for a specific emoji, use it's code point(s):
# http://0.0.0.0:8080/src/emoji?128153

# To view the raw browser action "app":
# http://0.0.0.0:8080/src/browser_action.html
```

Compile SASS into css:

```sh
# Use VSCode's SASS live watch plugin, or...
sass --update src/browser_action/all.sass
```

Run Tests:

```sh
node src/app_data/emoji.test.js

# If it says "localStorage not available", that's WAI, don't worry.
```



Update the thesaurus decorated contents in `data/emojilib_thesaurus.js`:

```sh
npm i # install dev dependencies
node scripts/thesaurus.js
```

## Extension Development Gripes

### Three Environments

When building one of these, I think most developers will want to do testing on the command line with Node, rapid development with live reload in the browser, and of course must deploy to a Chrome extension target.

I have had no end of bugs that only exhibit on one or another of these platforms. Sometimes it's only broken when run in an extension context. Sometimes only in node for tests.

Most extensions are simple and adding a rollup/webpack build system seems like a lot of overhead that isn't deserved, but it's hard to avoid. Would be nice for Chrome to get opinionated about this and make a happy path Typescript/test/local dev environment for extensions that is impossible to mess up.

## Deploying

Create an extension-deployable zip file:

```sh
node scripts/zip
```

Create an extension-deployable zip file and unpack it for local testing with Chrome:

```sh
node scripts/zip && unzip -o ./dist/emoji-magic.zip -d ./dist/emoji-magic
```

## Contributing

Contributions welcome. See `CONTRIBUTING.md`.

## Technical Design

Dead simple version: Just return everything that contains the search query anywhere inside keywords or icon name.

1. ~~break search into tokens~~
2. ~~prefix match each token~~

## Thanks and Credits

* Extension boilerplate from [extensionizr](extensionizr.com).
* Logo from [twemoji](https://github.com/twitter/twemoji).
* Emoji data source [emojilib](https://github.com/muan/emojilib).

[1]: https://www.extrahop.com/company/blog/2018/fake-chrome-extension-threat-hunt/

[2]: https://www.wired.com/story/chrome-extension-malware/

[3]: https://krebsonsecurity.com/2018/09/browser-extensions-are-they-worth-the-risk/

## Disclaimer

This is not an officially supported Google product.