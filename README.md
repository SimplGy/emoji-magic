# Emoji Magic

> Find Emoji using keywords.

![gif in action](./screenshots/demo.gif?raw=true)

Inspired by the ease of use of [mojibar](https://github.com/muan/mojibar).

Born of a desire to improve emoji searching even further.

## How to Use

1. Click the extension icon: `🔮`
2. Type what you want, like "cat"
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
python -m SimpleHTTPServer 8080

# To view the demo version of the app with a "website" wrapper:
# http://0.0.0.0:8080/src/

# To view the "details" for a specific emoji, use it's code point(s):
# http://0.0.0.0:8080/src/emoji?128153

# To view the raw browser action "app":
# http://0.0.0.0:8080/src/browser_action.html
```

Compile SASS into css:

    # Use VSCode's SASS live watch plugin, or...
    sass --update src/app_ui/emoji_picker.sass src/site/site.sass

Run Tests:

    npm test

Run live watching tests (needs `npm i -g nodemon`):

    nodemon --exec npm test


Update the thesaurus-annotated contents in `data/emojilib_thesaurus.js`:

    npm i # install dev dependencies
    node scripts/thesaurus.js

## About the folders

* `dist` -- dist bundle for chrome extention
* `docs` -- for the demo web app. Called "docs" for Github Static Pages. Don't modify things here. Modify `src`, then run the build step.
* `src` -- this is the only source code you should be editing

## Uh, what's up with the crazy module system?

I wanted an environment that works in:

1. The Browser (for web app and demo)
2. Chrome Extension (for the main use case)
3. Node (for tests)

I also didn't want a build system, for... reasons (for fun). And also just the dependencies they involve, and the complexity... just didn't seem worth it. So, that's what `emulate_node_modules.js` is about. It works just fine, so long as you add an `__id__` for every module that matches the file name, and don't make a module that has the same name as a different one.

## Extension Development Gripes

### Three Environments

When building one of these, I think most developers will want to do testing on the command line with Node, rapid development with live reload in the browser, and of course must deploy to a Chrome extension target.

I have had no end of bugs that only exhibit on one or another of these platforms. Sometimes it's only broken when run in an extension context. Sometimes only in node for tests.

Most extensions are simple and adding a rollup/webpack build system seems like a lot of overhead that isn't deserved, but it's hard to avoid. Would be nice for Chrome to get opinionated about this and make a happy path Typescript/test/local dev environment for extensions that is impossible to mess up.

## Updating the Emoji Data (new Unicode emoji available)

1. `node scripts/update-3p.js` to update the raw data set (`emoji-en-US.json` and `data-by-emoji.json`)
1. `node scripts/thesaurus.js` to re-generate the thesaurus (`emojilib_thesaurus.js`)
1. `python -m SimpleHTTPServer 8080` to test in the web ui

If you're happy with the results, bump the manifest version and follow the steps in the "Deploying" section.

## Deploying

Create an extension-deployable zip file:

```sh
node scripts/zip
```

Create an extension-deployable zip file and unpack it for local testing with Chrome:

```sh
rm -rf ./dist/emoji-magic && node scripts/zip && unzip -o ./dist/emoji-magic.zip -d ./dist/emoji-magic
# test by using "load unpacked extension" in Chrome
```

Build the "web app" demo version to `docs/` (so named for [Github Pages](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source)):

```sh
node scripts/to-docs
# test with `serve docs`
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