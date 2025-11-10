/**
 * Storage Service
 * Handles JSON import/export and file operations
 */

export class StorageService {
  /**
   * Export data to JSON file
   */
  exportToFile(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from JSON file
   * Returns a Promise that resolves with the parsed JSON data
   */
  importFromFile() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            resolve(data);
          } catch (error) {
            reject(new Error('Invalid JSON file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      };

      input.click();
    });
  }

  /**
   * Save to localStorage
   */
  saveToLocalStorage(key, data) {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(key, json);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Load from localStorage
   */
  loadFromLocalStorage(key) {
    try {
      const json = localStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove from localStorage
   */
  removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * List all saved courses in localStorage
   */
  listSavedCourses() {
    const courses = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('course_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          courses.push({
            key,
            title: data.title,
            updatedAt: data.updatedAt,
            id: data.id
          });
        } catch (error) {
          console.error(`Failed to parse course ${key}:`, error);
        }
      }
    }
    return courses.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

// Export singleton instance
export const storageService = new StorageService();
