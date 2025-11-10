/**
 * Course Service
 * Business logic for managing courses
 */

import { Course, Section } from '../core/models.js';

export class CourseService {
  constructor() {
    this.currentCourse = null;
  }

  createCourse(data) {
    this.currentCourse = new Course(data);
    return this.currentCourse;
  }

  loadCourse(courseData) {
    this.currentCourse = Course.fromJSON(courseData);
    return this.currentCourse;
  }

  getCurrentCourse() {
    return this.currentCourse;
  }

  updateCourse(updates) {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    Object.assign(this.currentCourse, updates);
    this.currentCourse.touch();
    return this.currentCourse;
  }

  addSection(sectionData) {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    const section = new Section(sectionData);
    this.currentCourse.addSection(section);
    return section;
  }

  updateSection(sectionId, updates) {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    const section = this.currentCourse.sections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error(`Section ${sectionId} not found`);
    }

    Object.assign(section, updates);
    section.touch();
    this.currentCourse.touch();
    return section;
  }

  deleteSection(sectionId) {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    this.currentCourse.removeSection(sectionId);
  }

  moveSection(sectionId, newIndex) {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    this.currentCourse.moveSection(sectionId, newIndex);
  }

  exportCourse() {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    return this.currentCourse.toJSON();
  }

  exportSection(sectionId) {
    if (!this.currentCourse) {
      throw new Error('No active course');
    }

    const section = this.currentCourse.sections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error(`Section ${sectionId} not found`);
    }

    return section.toJSON();
  }

  importSection(sectionData) {
    return this.addSection(sectionData);
  }
}

// Export singleton instance
export const courseService = new CourseService();
