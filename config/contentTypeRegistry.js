/**
 * Content Type Registry
 *
 * This is where you register all available content type plugins.
 * To add a new content type:
 * 1. Create your plugin in plugins/
 * 2. Import it here
 * 3. Add it to the contentTypes array
 */

import markdownPlugin from '../plugins/markdownPlugin.js';
import videoPlugin from '../plugins/videoPlugin.js';
import documentPlugin from '../plugins/documentPlugin.js';

/**
 * Array of all registered content type plugins
 * Order determines the order they appear in the UI
 */
const contentTypes = [
  markdownPlugin,
  videoPlugin,
  documentPlugin
  // Add new plugins here
];

/**
 * Content Type Registry Service
 * Provides access to registered content type plugins
 */
export class ContentTypeRegistry {
  constructor() {
    this.plugins = new Map();
    this.registerPlugins(contentTypes);
  }

  registerPlugins(plugins) {
    plugins.forEach(plugin => {
      this.plugins.set(plugin.type, plugin);
    });
  }

  getPlugin(type) {
    return this.plugins.get(type);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  hasPlugin(type) {
    return this.plugins.has(type);
  }
}

// Export singleton instance
export const registry = new ContentTypeRegistry();
