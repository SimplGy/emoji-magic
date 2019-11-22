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

# You can now access the app at:
# http://0.0.0.0:8080/src/browser_action/
```

Compile SASS into css:

    // Use VSCode's SASS live watch plugin, or...
    sass src/browser_action/all.sass

Run Tests:

    TODO

## Deploying

Create an extension-deployable zip file:

    node scripts/zip

Create an extension-deployable zip file and unpack it for local testing with Chrome:

    node scripts/zip && unzip -o ./dist/emoji-magic.zip -d ./dist/emoji-magic

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