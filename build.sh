#!/bin/bash

# Exit on error
set -e

# Clean and create dist directory
rm -rf dist
mkdir -p dist

# Generate content hashes (first 8 characters of md5)
JS_HASH=$(md5sum js/main.js | cut -c1-8)
CSS_HASH=$(md5sum css/style.css | cut -c1-8)

echo "Building with hashes:"
echo "  JS:  $JS_HASH"
echo "  CSS: $CSS_HASH"

# Create subdirectories in dist
mkdir -p dist/js dist/css

# Minify with hashed filenames
terser js/main.js -o "dist/js/main.min.$JS_HASH.js" -c -m
cleancss -o "dist/css/style.min.$CSS_HASH.css" css/style.css

# Update HTML with hashed filenames
sed "s|css/style.css|css/style.min.$CSS_HASH.css|g; s|js/main.js|js/main.min.$JS_HASH.js|g" index.html > dist/index.html

echo "Build complete!"
echo "  dist/js/main.min.$JS_HASH.js"
echo "  dist/css/style.min.$CSS_HASH.css"
echo "  dist/index.html"
