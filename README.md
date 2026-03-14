# Sort Zero 0.1.2

Browser extension for Firefox and Chrome that keeps your bookmarks sorted. Always.

- **Zero UI**
- **Zero extra permissions**
- **Zero extra features**
- **71 lines of code**

## How it works

- Sorts all bookmarks on startup
- Re-sorts affected folder on every bookmark change
- Folders first, then bookmarks
- Alphabetical, case-insensitive
- Separators act as section boundaries

## Install

### Firefox

Install from [Firefox Add-ons](https://addons.mozilla.org/), or load temporarily for development:

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json`

### Chrome

Load for development:

1. Run `./package.sh`
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `dist/chrome/` directory

## License

MIT — Copyright (c) 2026 Benjamin Wright
