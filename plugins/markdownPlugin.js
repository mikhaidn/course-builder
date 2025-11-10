/**
 * Markdown Content Type Plugin
 * Supports rich text content using Markdown syntax
 */

export default {
  type: 'markdown',
  displayName: 'Markdown Text',
  icon: '📝',

  validate(data) {
    return data && typeof data.markdown === 'string';
  },

  renderEditor(container, data = {}, onChange) {
    const markdown = data.markdown || '';

    container.innerHTML = `
      <div class="markdown-editor">
        <textarea
          class="markdown-input"
          placeholder="Enter markdown text here..."
          rows="10">${markdown}</textarea>
        <div class="markdown-help">
          <small>
            <strong>Markdown supported:</strong>
            **bold**, *italic*, # Heading, [link](url), ![image](url), \`code\`, etc.
          </small>
        </div>
      </div>
    `;

    const textarea = container.querySelector('.markdown-input');
    textarea.addEventListener('input', (e) => {
      onChange({ markdown: e.target.value });
    });
  },

  renderView(container, data) {
    const markdown = data.markdown || '';

    // Check if marked library is available for rendering
    if (typeof marked !== 'undefined') {
      container.innerHTML = `
        <div class="markdown-content">
          ${marked.parse(markdown)}
        </div>
      `;
    } else {
      // Fallback: simple rendering with line breaks
      const html = markdown
        .split('\n')
        .map(line => {
          // Basic markdown-like rendering
          line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
          line = line.replace(/`(.*?)`/g, '<code>$1</code>');
          return line;
        })
        .join('<br>');

      container.innerHTML = `
        <div class="markdown-content">
          ${html}
        </div>
      `;
    }
  },

  exportData(data) {
    return data;
  },

  importData(data) {
    return data;
  }
};
