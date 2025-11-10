/**
 * MECS Adapter
 * Converts between internal format and MECS (Modular Educational Content Standard)
 * MECS Spec: https://github.com/yourusername/mecs-standard
 */

const MECS_VERSION = '1.0.0';

export class MECSAdapter {
  /**
   * Convert internal Course model to MECS format
   * @param {Course} course - Internal course model
   * @returns {object} MECS-formatted course
   */
  toMECS(course) {
    return {
      mecsVersion: MECS_VERSION,
      type: 'mecs:course',
      id: course.id,
      title: course.title,
      description: course.description || '',
      metadata: {
        author: course.author || '',
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      },
      sections: course.sections.map(s => this.sectionToMECS(s)),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    };
  }

  /**
   * Convert MECS format to internal Course model
   * @param {object} mecsData - MECS-formatted course
   * @returns {object} Internal course format
   */
  fromMECS(mecsData) {
    // Handle both MECS and legacy formats
    const isMECS = mecsData.mecsVersion && mecsData.type === 'mecs:course';

    if (isMECS) {
      return {
        id: mecsData.id,
        title: mecsData.title,
        description: mecsData.description || '',
        author: mecsData.metadata?.author || '',
        createdAt: mecsData.createdAt || mecsData.metadata?.createdAt || new Date().toISOString(),
        updatedAt: mecsData.updatedAt || mecsData.metadata?.updatedAt || new Date().toISOString(),
        sections: mecsData.sections.map(s => this.sectionFromMECS(s))
      };
    }

    // Legacy format (backward compatibility)
    return {
      id: mecsData.id,
      title: mecsData.title,
      description: mecsData.description || '',
      author: mecsData.author || '',
      createdAt: mecsData.createdAt || new Date().toISOString(),
      updatedAt: mecsData.updatedAt || new Date().toISOString(),
      sections: mecsData.sections?.map(s => this.sectionFromLegacy(s)) || []
    };
  }

  /**
   * Convert internal Section to MECS format
   * @param {Section} section - Internal section model
   * @returns {object} MECS-formatted section
   */
  sectionToMECS(section) {
    return {
      id: section.id,
      title: section.title,
      order: section.order || 0,
      contentType: this.mapContentType(section.contentType),
      content: this.mapContent(section.contentType, section.content),
      createdAt: section.createdAt,
      updatedAt: section.updatedAt
    };
  }

  /**
   * Convert MECS section to internal format
   * @param {object} mecsSection - MECS-formatted section
   * @returns {object} Internal section format
   */
  sectionFromMECS(mecsSection) {
    return {
      id: mecsSection.id,
      title: mecsSection.title,
      order: mecsSection.order || 0,
      contentType: this.unmapContentType(mecsSection.contentType),
      content: this.unmapContent(mecsSection.contentType, mecsSection.content),
      createdAt: mecsSection.createdAt || new Date().toISOString(),
      updatedAt: mecsSection.updatedAt || new Date().toISOString()
    };
  }

  /**
   * Convert legacy section format to internal format
   * @param {object} legacySection - Legacy section format
   * @returns {object} Internal section format
   */
  sectionFromLegacy(legacySection) {
    return {
      id: legacySection.id,
      title: legacySection.title,
      order: legacySection.order || 0,
      contentType: legacySection.contentType,
      content: legacySection.content,
      createdAt: legacySection.createdAt || new Date().toISOString(),
      updatedAt: legacySection.updatedAt || new Date().toISOString()
    };
  }

  /**
   * Map internal content type to MECS namespaced type
   * @param {string} type - Internal type name
   * @returns {string} MECS namespaced type
   */
  mapContentType(type) {
    const mapping = {
      'markdown': 'mecs:text',
      'video': 'mecs:video',
      'document': 'mecs:document'
    };

    return mapping[type] || `custom:${type}`;
  }

  /**
   * Map MECS namespaced type to internal content type
   * @param {string} mecsType - MECS namespaced type
   * @returns {string} Internal type name
   */
  unmapContentType(mecsType) {
    const mapping = {
      'mecs:text': 'markdown',
      'mecs:video': 'video',
      'mecs:document': 'document'
    };

    if (mapping[mecsType]) {
      return mapping[mecsType];
    }

    // Handle custom types
    if (mecsType.startsWith('custom:')) {
      return mecsType.replace('custom:', '');
    }

    // Unknown type, return as-is
    return mecsType;
  }

  /**
   * Map internal content to MECS format
   * @param {string} type - Internal type
   * @param {object} content - Internal content
   * @returns {object} MECS content
   */
  mapContent(type, content) {
    switch (type) {
      case 'markdown':
        return {
          format: 'markdown',
          text: content.markdown || ''
        };

      case 'video':
        return {
          url: content.url || '',
          title: content.title || '',
          description: content.description || '',
          provider: this.detectProvider(content.url)
        };

      case 'document':
        return {
          url: content.url || '',
          title: content.title || '',
          description: content.description || '',
          docType: content.docType || 'other'
        };

      default:
        return content;
    }
  }

  /**
   * Map MECS content to internal format
   * @param {string} mecsType - MECS type
   * @param {object} mecsContent - MECS content
   * @returns {object} Internal content
   */
  unmapContent(mecsType, mecsContent) {
    const internalType = this.unmapContentType(mecsType);

    switch (internalType) {
      case 'markdown':
        return {
          markdown: mecsContent.text || ''
        };

      case 'video':
        return {
          url: mecsContent.url || '',
          title: mecsContent.title || '',
          description: mecsContent.description || ''
        };

      case 'document':
        return {
          url: mecsContent.url || '',
          title: mecsContent.title || '',
          description: mecsContent.description || '',
          docType: mecsContent.docType || 'other'
        };

      default:
        return mecsContent;
    }
  }

  /**
   * Detect video provider from URL
   * @param {string} url - Video URL
   * @returns {string} Provider name
   */
  detectProvider(url) {
    if (!url) return 'other';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    return 'direct';
  }

  /**
   * Check if data is in MECS format
   * @param {object} data - Data to check
   * @returns {boolean} True if MECS format
   */
  isMECS(data) {
    return data && data.mecsVersion && data.type === 'mecs:course';
  }

  /**
   * Validate MECS data (basic validation)
   * @param {object} mecsData - MECS data to validate
   * @returns {object} { valid: boolean, errors: string[] }
   */
  validate(mecsData) {
    const errors = [];

    if (!mecsData) {
      errors.push('Data is null or undefined');
      return { valid: false, errors };
    }

    if (!mecsData.mecsVersion) {
      errors.push('Missing mecsVersion field');
    }

    if (mecsData.type !== 'mecs:course') {
      errors.push('Invalid type field (expected "mecs:course")');
    }

    if (!mecsData.id || !mecsData.title) {
      errors.push('Missing required fields: id and title');
    }

    if (!Array.isArray(mecsData.sections)) {
      errors.push('Sections must be an array');
    }

    // Validate sections
    if (Array.isArray(mecsData.sections)) {
      mecsData.sections.forEach((section, index) => {
        if (!section.id || !section.title) {
          errors.push(`Section ${index}: Missing id or title`);
        }
        if (!section.contentType || !section.contentType.includes(':')) {
          errors.push(`Section ${index}: Invalid contentType (must be namespaced)`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const mecsAdapter = new MECSAdapter();
