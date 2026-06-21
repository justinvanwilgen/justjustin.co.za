#!/bin/bash

# Exit on error
set -e

# Clean and create dist directory
rm -rf dist
mkdir -p dist

# Generate content hashes (first 8 characters of md5)
JS_HASH=$(md5sum js/main.js | cut -c1-8)
CSS_HASH=$(md5sum css/style.css | cut -c1-8)
ICONS_JS_HASH=$(md5sum js/tech-icons.js | cut -c1-8)
ICONS_CSS_HASH=$(md5sum css/tech-icons.css | cut -c1-8)

echo "Building with hashes:"
echo "  JS:        $JS_HASH"
echo "  CSS:       $CSS_HASH"
echo "  ICONS JS:  $ICONS_JS_HASH"
echo "  ICONS CSS: $ICONS_CSS_HASH"

# Create subdirectories in dist
mkdir -p dist/js dist/css

# Copy static icon assets verbatim
cp -r assets dist/assets

# Minify with hashed filenames
terser js/main.js -o "dist/js/main.min.$JS_HASH.js" -c -m
terser js/tech-icons.js -o "dist/js/tech-icons.min.$ICONS_JS_HASH.js" -c -m
cleancss -o "dist/css/style.min.$CSS_HASH.css" css/style.css
cleancss -o "dist/css/tech-icons.min.$ICONS_CSS_HASH.css" css/tech-icons.css

# Update HTML with hashed filenames
sed "s|css/style.css|css/style.min.$CSS_HASH.css|g; s|css/tech-icons.css|css/tech-icons.min.$ICONS_CSS_HASH.css|g; s|js/main.js|js/main.min.$JS_HASH.js|g; s|js/tech-icons.js|js/tech-icons.min.$ICONS_JS_HASH.js|g" index.html > dist/index.html

echo "Build complete!"
echo "  dist/js/main.min.$JS_HASH.js"
echo "  dist/js/tech-icons.min.$ICONS_JS_HASH.js"
echo "  dist/css/style.min.$CSS_HASH.css"
echo "  dist/css/tech-icons.min.$ICONS_CSS_HASH.css"
echo "  dist/index.html"
