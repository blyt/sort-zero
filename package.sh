#!/bin/bash
set -e

rm -rf dist
mkdir -p dist/firefox dist/chrome

cp background.js manifest.json dist/firefox/
cp -r icons dist/firefox/

cp background.js manifest.chrome.json dist/chrome/
mv dist/chrome/manifest.chrome.json dist/chrome/manifest.json
cp -r icons dist/chrome/

VERSION=$(grep '"version"' manifest.json | head -1 | sed 's/.*"\([0-9.]*\)".*/\1/')

(cd dist/firefox && zip -r "../sort-zero-firefox-${VERSION}.zip" .)
(cd dist/chrome && zip -r "../sort-zero-chrome-${VERSION}.zip" .)

echo "Packaged dist/sort-zero-firefox-${VERSION}.zip and dist/sort-zero-chrome-${VERSION}.zip"
