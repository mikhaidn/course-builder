/**
 * Document Content Type Plugin
 * Supports linking to external documents (PDFs, Google Docs, etc.)
 */

export default {
  type: 'document',
  displayName: 'Document Link',
  icon: '📄',

  validate(data) {
    return data && typeof data.url === 'string' && data.url.trim().length > 0;
  },

  renderEditor(container, data = {}, onChange) {
    const url = data.url || '';
    const title = data.title || '';
    const description = data.description || '';
    const docType = data.docType || 'pdf';

    container.innerHTML = `
      <div class="document-editor">
        <div class="form-group">
          <label>Document Title *</label>
          <input
            type="text"
            class="doc-title"
            placeholder="e.g., Calculus I Syllabus"
            value="${title}"
            required />
        </div>

        <div class="form-group">
          <label>Document Type</label>
          <select class="doc-type">
            <option value="pdf" ${docType === 'pdf' ? 'selected' : ''}>PDF</option>
            <option value="google-doc" ${docType === 'google-doc' ? 'selected' : ''}>Google Doc</option>
            <option value="word" ${docType === 'word' ? 'selected' : ''}>Word Document</option>
            <option value="slides" ${docType === 'slides' ? 'selected' : ''}>Presentation Slides</option>
            <option value="other" ${docType === 'other' ? 'selected' : ''}>Other</option>
          </select>
        </div>

        <div class="form-group">
          <label>Document URL *</label>
          <input
            type="url"
            class="doc-url"
            placeholder="https://example.com/document.pdf"
            value="${url}"
            required />
        </div>

        <div class="form-group">
          <label>Description (optional)</label>
          <textarea
            class="doc-description"
            placeholder="Brief description of the document"
            rows="3">${description}</textarea>
        </div>
      </div>
    `;

    const titleInput = container.querySelector('.doc-title');
    const typeInput = container.querySelector('.doc-type');
    const urlInput = container.querySelector('.doc-url');
    const descInput = container.querySelector('.doc-description');

    const updateData = () => {
      onChange({
        title: titleInput.value,
        docType: typeInput.value,
        url: urlInput.value,
        description: descInput.value
      });
    };

    titleInput.addEventListener('input', updateData);
    typeInput.addEventListener('change', updateData);
    urlInput.addEventListener('input', updateData);
    descInput.addEventListener('input', updateData);
  },

  renderView(container, data) {
    const url = data.url || '';
    const title = data.title || 'Document';
    const description = data.description || '';
    const docType = data.docType || 'pdf';

    const typeIcons = {
      'pdf': '📕',
      'google-doc': '📗',
      'word': '📘',
      'slides': '📊',
      'other': '📄'
    };

    const icon = typeIcons[docType] || '📄';

    container.innerHTML = `
      <div class="document-content">
        <div class="document-card">
          <div class="document-icon">${icon}</div>
          <div class="document-info">
            <h3 class="document-title">${title}</h3>
            ${description ? `<p class="document-description">${description}</p>` : ''}
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="document-link">
              Open Document →
            </a>
          </div>
        </div>
      </div>
    `;
  },

  exportData(data) {
    return data;
  },

  importData(data) {
    return data;
  }
};
