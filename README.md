# Course Builder

A simple web app for creating educational courses with drag-and-drop sections.

![MECS Compatible](https://img.shields.io/badge/MECS-v0.1.0-blue)

## Quick Start

1. **Run the app:**
   ```bash
   cd ~/git/course-builder
   python3 -m http.server 8000
   ```
   Open http://localhost:8000

2. **Try the example:**
   - Click "Import JSON"
   - Load `examples/calculus_i_example.json`

3. **Create your course:**
   - Add sections (Markdown, Video, or Document)
   - Drag to reorder
   - Export as JSON

## Features

- 📝 **Three content types:** Markdown, Video URLs, Document links
- 🎨 **Clean interface:** Separate view/edit modes
- ↕️ **Drag & drop:** Reorder sections easily
- 💾 **Export/Import:** Standard JSON format ([MECS](https://github.com/mikhaidn/mecs-standard))
- 🔌 **Extensible:** Add custom content types

## Example Usage

```javascript
// Create a course
const course = {
  title: "Introduction to Python",
  sections: [
    { type: "markdown", content: "# Welcome..." },
    { type: "video", url: "https://..." }
  ]
}
```

## Project Structure

```
course-builder/
├── index.html          # Main app
├── core/              # Data models
├── plugins/           # Content types
├── services/          # Business logic
└── ui/                # Interface
```

## Documentation

- **[Plugin Guide](docs/PLUGIN_GUIDE.md)** - Create custom content types
- **[Architecture](docs/ARCHITECTURE.md)** - Design principles
- **[MECS Implementation](docs/STANDARD_IMPLEMENTATION.md)** - Standard support
- **[Quick Start Guide](QUICKSTART.md)** - Detailed tutorial

## MECS Standard

Courses export in [MECS format](https://github.com/mikhaidn/mecs-standard) - an open standard for educational content that works across platforms.

## Development

```bash
# No build step needed - just open in browser
# For local development:
python3 -m http.server 8000
```

## License

MIT

---

**Built to implement the [MECS standard](https://github.com/mikhaidn/mecs-standard)**
