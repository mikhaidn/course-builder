/**
 * Video Content Type Plugin
 * Supports embedding videos via URLs (YouTube, Vimeo, direct video links)
 */

export default {
  type: 'video',
  displayName: 'Video',
  icon: '🎥',

  validate(data) {
    return data && typeof data.url === 'string' && data.url.trim().length > 0;
  },

  renderEditor(container, data = {}, onChange) {
    const url = data.url || '';
    const title = data.title || '';
    const description = data.description || '';

    container.innerHTML = `
      <div class="video-editor">
        <div class="form-group">
          <label>Video Title (optional)</label>
          <input
            type="text"
            class="video-title"
            placeholder="e.g., Introduction to Calculus"
            value="${title}" />
        </div>

        <div class="form-group">
          <label>Video URL *</label>
          <input
            type="url"
            class="video-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value="${url}"
            required />
          <small>Supports YouTube, Vimeo, or direct video links</small>
        </div>

        <div class="form-group">
          <label>Description (optional)</label>
          <textarea
            class="video-description"
            placeholder="Brief description of the video content"
            rows="3">${description}</textarea>
        </div>
      </div>
    `;

    const titleInput = container.querySelector('.video-title');
    const urlInput = container.querySelector('.video-url');
    const descInput = container.querySelector('.video-description');

    const updateData = () => {
      onChange({
        title: titleInput.value,
        url: urlInput.value,
        description: descInput.value
      });
    };

    titleInput.addEventListener('input', updateData);
    urlInput.addEventListener('input', updateData);
    descInput.addEventListener('input', updateData);
  },

  renderView(container, data) {
    const url = data.url || '';
    const title = data.title || 'Video';
    const description = data.description || '';

    // Convert YouTube/Vimeo URLs to embed format
    const embedUrl = this.getEmbedUrl(url);

    container.innerHTML = `
      <div class="video-content">
        ${title ? `<h3 class="video-title">${title}</h3>` : ''}
        ${description ? `<p class="video-description">${description}</p>` : ''}
        ${embedUrl ? `
          <div class="video-wrapper">
            <iframe
              src="${embedUrl}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        ` : `
          <div class="video-link">
            <a href="${url}" target="_blank" rel="noopener noreferrer">
              🎥 Open Video: ${url}
            </a>
          </div>
        `}
      </div>
    `;
  },

  getEmbedUrl(url) {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct video files
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return null; // Will use video link instead
    }

    return null;
  },

  exportData(data) {
    return data;
  },

  importData(data) {
    return data;
  }
};
