# Course Builder

A lightweight, modular GUI for creating, sharing, and working on courses with chunked sections.

## Features

- **Modular Content Types**: Markdown text, video URLs, and document links
- **Extensible Plugin Architecture**: Easy to add new content types
- **JSON Export/Import**: Entire courses or individual sections
- **Clean Architecture**: Dependency inversion and minimal coupling

## Project Structure

```
course-builder/
├── config/           # Configuration and content type registry (opinions)
├── core/             # Core domain models and interfaces (stable)
├── plugins/          # Content type implementations (extensible)
├── services/         # Business logic layer
├── ui/               # User interface components
└── examples/         # Example courses
```

## Getting Started

1. Open `index.html` in a web browser
2. Create a new course or load an existing JSON file
3. Add sections with different content types
4. Export your course as JSON

## Adding New Content Types

See `PLUGIN_GUIDE.md` for instructions on creating new content type plugins.

## Architecture

This application follows clean architecture principles:
- **Core**: Domain models that should rarely change
- **Plugins**: Isolated content type implementations
- **Config**: Registry that wires plugins together
- **Services**: Business logic coordinating core and plugins
- **UI**: Presentation layer

New content types can be added by:
1. Creating a plugin in `plugins/`
2. Registering it in `config/contentTypeRegistry.js`
