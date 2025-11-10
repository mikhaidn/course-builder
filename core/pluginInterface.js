/**
 * Content Type Plugin Interface
 *
 * All content type plugins must implement this interface.
 * This is the contract between the core system and plugins.
 */

export class ContentTypePlugin {
  /**
   * @returns {string} Unique identifier for this content type
   */
  get type() {
    throw new Error('Plugin must implement type getter');
  }

  /**
   * @returns {string} Human-readable display name
   */
  get displayName() {
    throw new Error('Plugin must implement displayName getter');
  }

  /**
   * @returns {string} Icon representation (emoji or HTML)
   */
  get icon() {
    throw new Error('Plugin must implement icon getter');
  }

  /**
   * Validate content data
   * @param {object} data - The content data to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validate(data) {
    throw new Error('Plugin must implement validate()');
  }

  /**
   * Render editor interface for creating/editing content
   * @param {HTMLElement} container - Container to render into
   * @param {object} data - Current content data
   * @param {function} onChange - Callback when data changes: onChange(newData)
   */
  renderEditor(container, data, onChange) {
    throw new Error('Plugin must implement renderEditor()');
  }

  /**
   * Render content for viewing
   * @param {HTMLElement} container - Container to render into
   * @param {object} data - Content data to display
   */
  renderView(container, data) {
    throw new Error('Plugin must implement renderView()');
  }

  /**
   * Transform data before export (optional)
   * @param {object} data - Content data
   * @returns {object} Transformed data for JSON export
   */
  exportData(data) {
    return data; // Default: no transformation
  }

  /**
   * Transform data after import (optional)
   * @param {object} data - Content data from JSON
   * @returns {object} Transformed data for internal use
   */
  importData(data) {
    return data; // Default: no transformation
  }
}
