#!/bin/bash
set -e

rm -rf dist
mkdir -p dist/firefox dist/chrome

cp background.js manifest.json dist/firefox/
cp -r icons dist/firefox/

cp background.js manifest.chrome.json dist/chrome/
mv dist/chrome/manifest.chrome.json dist/chrome/manifest.json
cp -r icons dist/chrome/

echo "Packaged dist/firefox/ and dist/chrome/"
