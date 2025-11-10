/**
 * Core Domain Models
 * These represent the fundamental structure and should remain stable.
 */

/**
 * Course Model
 * Represents a complete course with metadata and sections
 */
export class Course {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || 'Untitled Course';
    this.description = data.description || '';
    this.author = data.author || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.sections = (data.sections || []).map(s => new Section(s));
  }

  generateId() {
    return `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addSection(section) {
    this.sections.push(section);
    this.touch();
  }

  removeSection(sectionId) {
    this.sections = this.sections.filter(s => s.id !== sectionId);
    this.touch();
  }

  moveSection(sectionId, newIndex) {
    const currentIndex = this.sections.findIndex(s => s.id === sectionId);
    if (currentIndex === -1) return;

    const [section] = this.sections.splice(currentIndex, 1);
    this.sections.splice(newIndex, 0, section);
    this.touch();
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      sections: this.sections.map(s => s.toJSON())
    };
  }

  static fromJSON(json) {
    return new Course(json);
  }
}

/**
 * Section Model
 * Represents a single section within a course
 */
export class Section {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || 'Untitled Section';
    this.order = data.order || 0;
    this.contentType = data.contentType || 'markdown';
    this.content = data.content || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateId() {
    return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateContent(content) {
    this.content = content;
    this.touch();
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      order: this.order,
      contentType: this.contentType,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(json) {
    return new Section(json);
  }
}
