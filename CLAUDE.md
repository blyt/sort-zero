# Sort Zero

Cross-browser WebExtension (Manifest V3) for Firefox and Chrome that automatically sorts bookmark folders alphabetically with folders first, respecting separators as section boundaries (Firefox only — Chrome has no separators). No UI, no configuration. Sorts everything on load and on every bookmark event.

## Architecture

- `background.js` — All logic, shared by both browsers. Uses `globalThis.browser ?? globalThis.chrome` for API access. Sorts all bookmarks on startup, then listens to onCreated/onMoved/onRemoved/onChanged with per-folder debounce (250ms). Folders first, ascending, case-insensitive, separator-aware.
- `manifest.json` — Firefox MV3 manifest (background scripts). Single permission: `bookmarks`.
- `manifest.chrome.json` — Chrome MV3 manifest (service worker). Single permission: `bookmarks`.
- `package.sh` — Builds `dist/firefox/` and `dist/chrome/` with the correct manifest.

## Rules

- **Do not add new permissions to manifest.json or manifest.chrome.json.**
- Sort algorithm must always call `move()` for every item — no index-comparison optimizations.
- Sorting guard uses a counter (`sortingCount`), not a boolean.
- Debounce callbacks check `sortingCount === 0` before sorting.
- When changing background.js, count non-blank lines and update the line count in both README.md and manifest.json description.
- When bumping the version, update it in manifest.json, manifest.chrome.json, README.md, and any other files that reference it.
