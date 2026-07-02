#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Copy admin.html
cp "$SCRIPT_DIR/admin.html" "$SCRIPT_DIR/dist/admin.html"
echo "  └─ admin.html copied to dist/"

# Copy doc.html
cp "$SCRIPT_DIR/doc.html" "$SCRIPT_DIR/dist/doc.html"
echo "  └─ doc.html copied to dist/"

# Copy data/ directory for dynamic imports in admin.html
cp -r "$SCRIPT_DIR/data" "$SCRIPT_DIR/dist/data" 2>/dev/null
echo "  └─ data/ copied to dist/data/"
