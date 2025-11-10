# Plugin Development Guide

## Creating a New Content Type Plugin

Content type plugins allow you to extend Course Builder with new types of content sections.

### Step 1: Create Your Plugin File

Create a new file in `plugins/` directory, e.g., `plugins/quizPlugin.js`:

```javascript
// plugins/quizPlugin.js
export default {
  // Unique identifier for this content type
  type: 'quiz',

  // Display name shown in UI
  displayName: 'Quiz',

  // Icon (emoji or HTML)
  icon: '❓',

  // Validate content data
  validate(data) {
    // Return true if valid, false otherwise
    return data && typeof data.question === 'string';
  },

  // Render editor form for creating/editing content
  renderEditor(container, data = {}, onChange) {
    container.innerHTML = `
      <input type="text"
             class="quiz-question"
             placeholder="Enter question"
             value="${data.question || ''}" />
    `;

    const input = container.querySelector('.quiz-question');
    input.addEventListener('input', (e) => {
      onChange({ question: e.target.value });
    });
  },

  // Render content for viewing
  renderView(container, data) {
    container.innerHTML = `
      <div class="quiz-content">
        <strong>Q:</strong> ${data.question}
      </div>
    `;
  },

  // Export data for JSON serialization (optional transform)
  exportData(data) {
    return data; // Return as-is or transform
  },

  // Import data from JSON (optional transform)
  importData(data) {
    return data; // Return as-is or transform
  }
};
```

### Step 2: Register Your Plugin

Add your plugin to `config/contentTypeRegistry.js`:

```javascript
import quizPlugin from '../plugins/quizPlugin.js';

const contentTypes = [
  markdownPlugin,
  videoPlugin,
  documentPlugin,
  quizPlugin // Add your plugin here
];
```

That's it! Your plugin will now appear in the content type selector.

## Plugin Interface

All plugins must implement:

- **type** (string): Unique identifier
- **displayName** (string): Human-readable name
- **icon** (string): Icon representation
- **validate(data)**: Returns boolean
- **renderEditor(container, data, onChange)**: Renders edit form
- **renderView(container, data)**: Renders display view
- **exportData(data)** (optional): Transform before export
- **importData(data)** (optional): Transform after import

## Best Practices

1. Keep plugins isolated - no dependencies on other plugins
2. Use standard HTML/CSS for maximum compatibility
3. Validate all user input
4. Handle empty/null data gracefully
5. Make editor forms intuitive and accessible
