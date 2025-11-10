# Quick Start Guide

## Running the Application

1. **Open the application**:
   - Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Python 2
     python -m SimpleHTTPServer 8000

     # Using Node.js (http-server)
     npx http-server
     ```
   - Then navigate to `http://localhost:8000`

2. **Try the example course**:
   - Click "Import JSON"
   - Select `examples/calculus_i_example.json`
   - Explore the different section types!

## Creating Your First Course

1. **Set up course details**:
   - Enter a title (e.g., "Python Programming 101")
   - Add your name as the author
   - Write a brief description

2. **Add sections**:
   - Click one of the content type buttons:
     - 📝 Markdown Text - For written content with formatting
     - 🎥 Video - For YouTube/Vimeo videos or video URLs
     - 📄 Document Link - For PDFs, Google Docs, etc.

3. **Edit section content**:
   - Click a section in the sidebar to edit it
   - Update the title
   - Fill in the content
   - Click "Save Section"

4. **Preview your course**:
   - Click "Preview" to see how it looks
   - Click "Edit Mode" to return to editing

5. **Save your work**:
   - Click "Save" to store locally in browser
   - Click "Export JSON" to download a JSON file

## Sharing Courses

### Method 1: Export/Import JSON
- Export your course as JSON
- Share the file via email, cloud storage, etc.
- Recipients can import it using "Import JSON"

### Method 2: Browser Storage
- Courses are automatically saved in your browser's localStorage
- Use "Save" frequently to avoid losing work
- Use "Load" to switch between saved courses

## Tips

- **Use Preview Mode**: Test how your content looks before sharing
- **Export Regularly**: Keep backups of your JSON files
- **Organize Sections**: Use the ↑ ↓ buttons to reorder sections
- **Markdown Syntax**: Use [this guide](https://www.markdownguide.org/basic-syntax/) for formatting help

## Keyboard Shortcuts

Currently, all actions are button-based. Keyboard shortcuts may be added in future versions!

## Need Help?

Check the README.md and PLUGIN_GUIDE.md for more detailed documentation.
