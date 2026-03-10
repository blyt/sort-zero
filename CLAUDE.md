# Sort Zero

Firefox WebExtension (Manifest V3) that automatically sorts bookmark folders alphabetically with folders first, respecting separators as section boundaries. No UI, no configuration. Sorts everything on load and on every bookmark event.

## Architecture

- `background.js` — All logic. Sorts all bookmarks on startup, then listens to onCreated/onMoved/onRemoved/onChanged with per-folder debounce (250ms). Folders first, ascending, case-insensitive, separator-aware.
- `manifest.json` — MV3 manifest. Single permission: `bookmarks`.

## Rules

- **Do not add new permissions to manifest.json.**
- Sort algorithm must always call `move()` for every item — no index-comparison optimizations.
- Sorting guard uses a counter (`sortingCount`), not a boolean.
- Debounce callbacks check `sortingCount === 0` before sorting.
- Keep the line count in README.md and manifest.json description up to date when changing background.js (count non-blank lines only).
