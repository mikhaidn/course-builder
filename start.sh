#!/bin/bash
# Course Builder - Launch Script

echo "🚀 Starting Course Builder..."
echo "📚 Open your browser to: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8000
