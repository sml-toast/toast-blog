#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cp "$SCRIPT_DIR/admin.html" "$SCRIPT_DIR/dist/admin.html"
echo "  └─ admin.html copied to dist/"
