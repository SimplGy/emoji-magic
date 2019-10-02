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

## Security

This app requires absolutely minimal permissions.

1. Only clipboard access
1. No background script

Other extensions want to "read and change the data on all the sites you visit".

This is incredibly unsafe. Example: [1].

## Developing

Serve the local repo for live editing and a fast dev experience:

    python3 -m http.server 8080 # run in repo root
    
    # You can now access the app at:
    # http://0.0.0.0:8080/src/browser_action/

Create an extension-deployable zip file:

    node scripts/zip

## Contributing

Contributions welcome. See `CONTRIBUTING.md`.

## Technical Design

Dead simple version: Just return everything that contains the search query anywhere inside keywords or icon name.

1. ~~break search into tokens~~
2. ~~prefix match each token~~

## Thanks and Credits

* Extension boilerplate from [extensionizr](extensionizr.com).
* Logo from [twemoji](https://github.com/twitter/twemoji).
* Initial emoji data source [emojilib](https://github.com/muan/emojilib).
* animation from [@danden's animate.css](https://github.com/daneden/animate.css).

[1]: https://www.extrahop.com/company/blog/2018/fake-chrome-extension-threat-hunt/