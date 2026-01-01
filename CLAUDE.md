# Course Builder - AI Assistant Guide

**Version:** MECS v0.1.0 Compatible
**Type:** Pure client-side educational content builder
**Repository:** https://github.com/mikhaidn/course-builder

## Quick Context

This is a **zero-build** web application for creating educational courses. It implements the [MECS (Modular Educational Content Standard)](https://github.com/mikhaidn/mecs-standard) for interoperable course content.

### Tech Stack
- **Frontend:** Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Libraries:** marked.js (Markdown rendering)
- **Storage:** localStorage + JSON export/import
- **Server:** Python 3 http.server (development only)
- **Build:** None - static files only

## Project Structure

```
course-builder/
├── index.html              # Entry point
├── core/                   # Domain models
│   ├── models.js          # Course & Section classes
│   └── pluginInterface.js # Plugin contract definition
├── services/              # Business logic
│   ├── courseService.js   # Course management
│   ├── storageService.js  # Import/export & localStorage
│   └── mecsAdapter.js     # MECS standard converter
├── plugins/               # Content type plugins
│   ├── markdownPlugin.js  # Text content (mecs:text)
│   ├── videoPlugin.js     # Video embeds (mecs:video)
│   └── documentPlugin.js  # Document links (mecs:document)
├── ui/                    # User interface
│   ├── app.js            # Main application controller
│   └── styles.css        # Styling
├── config/
│   └── contentTypeRegistry.js  # Plugin registration
├── examples/              # Sample courses
└── docs/                  # Extended documentation
```

## Development Workflow

### Running Locally
```bash
# Method 1: Use the start script
./start.sh

# Method 2: Manual server
python3 -m http.server 8000
# Open http://localhost:8000
```

### Making Changes
1. **Edit files directly** - No build step needed
2. **Refresh browser** - Changes apply immediately
3. **Check browser console** - ES6 modules show clear errors

### Testing
- **Manual testing** - Open in browser and test functionality
- **No test framework** - Pure client-side app with manual QA
- **Browser compatibility** - Test in Chrome, Firefox, Safari, Edge

## Key Concepts

### 1. Plugin Architecture
All content types are plugins implementing this interface:

```javascript
{
  type: string,              // Unique ID (e.g., 'markdown')
  displayName: string,       // UI label (e.g., 'Markdown Text')
  icon: string,             // Display icon (emoji or HTML)
  validate(data): boolean,  // Content validation
  renderEditor(container, data, onChange),  // Edit UI
  renderView(container, data),              // Display UI
  exportData(data),         // Optional: transform on export
  importData(data)          // Optional: transform on import
}
```

**Adding a new plugin:**
1. Create `plugins/yourPlugin.js`
2. Import in `config/contentTypeRegistry.js`
3. Add to `contentTypes` array

See: [docs/PLUGIN_GUIDE.md](docs/PLUGIN_GUIDE.md)

### 2. MECS Standard Integration
The app converts between internal format and MECS standard format:

**Internal → MECS (Export)**
- `markdown` → `mecs:text`
- `video` → `mecs:video`
- `document` → `mecs:document`
- Custom plugins → `custom:pluginName`

**MECS → Internal (Import)**
- Reverse mapping with backward compatibility
- Validates MECS structure
- Handles both legacy and MECS formats

**Key file:** `services/mecsAdapter.js`

### 3. Data Models

**Course Model** (`core/models.js`)
```javascript
{
  id: string,
  title: string,
  description: string,
  author: string,
  createdAt: ISO8601,
  updatedAt: ISO8601,
  sections: Section[]
}
```

**Section Model** (`core/models.js`)
```javascript
{
  id: string,
  title: string,
  order: number,
  contentType: string,      // Plugin type
  content: object,          // Plugin-specific data
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

## Common Tasks for AI Assistants

### Adding a New Content Type
1. Read existing plugin: `plugins/markdownPlugin.js`
2. Create new plugin file following the interface
3. Register in `config/contentTypeRegistry.js`
4. Test in browser

### Modifying MECS Format
1. Update `services/mecsAdapter.js`
2. Add mapping in `mapContentType()` / `unmapContentType()`
3. Handle content transformation in `mapContent()` / `unmapContent()`
4. Update MECS version constant if needed

### Fixing UI Issues
1. Check `ui/app.js` for application logic
2. Check `ui/styles.css` for styling
3. Check `index.html` for structure
4. Test in browser with DevTools

### Debugging
- **Console errors:** Check browser console for ES6 module errors
- **Data issues:** Check localStorage in DevTools → Application tab
- **Plugin errors:** Check plugin's `validate()` and render methods
- **Export issues:** Check `mecsAdapter.js` conversion logic

## Code Conventions

### Style Guidelines
- **ES6 modules:** Use `import`/`export` (not CommonJS)
- **Classes:** Use ES6 classes for models and services
- **Naming:** camelCase for variables/functions, PascalCase for classes
- **Singleton services:** Export instance as lowercase (e.g., `export const storageService`)
- **Comments:** JSDoc style for public APIs

### File Organization
- **One class per file** (models, services)
- **One plugin per file** (plugins)
- **Group related functions** (utilities, helpers)
- **Keep plugins independent** (no cross-plugin dependencies)

### Git Workflow
- **Branch naming:** `feature/description` or `fix/description`
- **Commits:** Descriptive messages, atomic changes
- **Testing:** Manual browser testing before committing

## Important Notes

### What This Project IS
- ✅ Static web app (no server-side code)
- ✅ Plugin-based architecture
- ✅ MECS standard compliant
- ✅ Zero build/compile step
- ✅ Browser-based storage

### What This Project IS NOT
- ❌ Not a Node.js/npm project (no package.json)
- ❌ Not using a framework (React, Vue, etc.)
- ❌ Not using a build tool (webpack, vite, etc.)
- ❌ Not using TypeScript
- ❌ No backend API or database

### Breaking Changes to Avoid
- **Don't** introduce build steps (keeps it simple)
- **Don't** break MECS format compatibility
- **Don't** add dependencies without strong justification
- **Don't** modify plugin interface without updating all plugins

## Resources

- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Plugin Guide:** [docs/PLUGIN_GUIDE.md](docs/PLUGIN_GUIDE.md)
- **MECS Implementation:** [docs/STANDARD_IMPLEMENTATION.md](docs/STANDARD_IMPLEMENTATION.md)
- **MECS Standard:** https://github.com/mikhaidn/mecs-standard
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)

## Recent Changes (Git History)

```
6957313 - Disable drag-and-drop reordering in edit mode
23bd443 - Reorganize docs and simplify README
e8b227a - Update to MECS v0.1.0 and add GitHub links
e521f0a - Implement MECS standard support
07f335b - Add drag-and-drop reordering + MECS standard architecture
```

---

**For AI Assistants:** This codebase prioritizes simplicity and standards compliance. When making changes:
1. Preserve the zero-build philosophy
2. Maintain MECS compatibility
3. Keep plugins independent and modular
4. Test thoroughly in browser before committing
