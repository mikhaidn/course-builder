/**
 * Application Controller
 * Coordinates UI, services, and plugins
 */

import { courseService } from '../services/courseService.js';
import { storageService } from '../services/storageService.js';
import { registry } from '../config/contentTypeRegistry.js';

export class App {
  constructor() {
    this.currentSection = null;
    this.viewMode = 'edit'; // 'edit' or 'view'
  }

  init() {
    this.setupEventListeners();
    this.renderContentTypeButtons();
    this.tryLoadLastCourse();
  }

  setupEventListeners() {
    // Course actions
    document.getElementById('new-course-btn').addEventListener('click', () => this.newCourse());
    document.getElementById('save-course-btn').addEventListener('click', () => this.saveCourse());
    document.getElementById('load-course-btn').addEventListener('click', () => this.loadCourse());
    document.getElementById('export-course-btn').addEventListener('click', () => this.exportCourse());
    document.getElementById('import-course-btn').addEventListener('click', () => this.importCourse());

    // Course metadata
    document.getElementById('course-title').addEventListener('input', (e) => this.updateCourseTitle(e.target.value));
    document.getElementById('course-description').addEventListener('input', (e) => this.updateCourseDescription(e.target.value));
    document.getElementById('course-author').addEventListener('input', (e) => this.updateCourseAuthor(e.target.value));

    // Section actions
    document.getElementById('export-section-btn').addEventListener('click', () => this.exportCurrentSection());
  }

  renderContentTypeButtons() {
    const container = document.getElementById('content-type-buttons');
    const plugins = registry.getAllPlugins();

    container.innerHTML = plugins.map(plugin => `
      <button class="content-type-btn" data-type="${plugin.type}">
        <span class="icon">${plugin.icon}</span>
        <span class="label">${plugin.displayName}</span>
      </button>
    `).join('');

    container.querySelectorAll('.content-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.addSection(type);
      });
    });
  }

  newCourse() {
    if (courseService.getCurrentCourse() && !confirm('Create a new course? Unsaved changes will be lost.')) {
      return;
    }

    courseService.createCourse({
      title: 'New Course',
      description: '',
      author: ''
    });

    this.renderCourse();
  }

  saveCourse() {
    const course = courseService.getCurrentCourse();
    if (!course) {
      alert('No course to save');
      return;
    }

    const key = `course_${course.id}`;
    storageService.saveToLocalStorage(key, course.toJSON());
    this.showMessage('Course saved successfully!');
  }

  async loadCourse() {
    const courses = storageService.listSavedCourses();
    if (courses.length === 0) {
      alert('No saved courses found');
      return;
    }

    const courseList = courses.map((c, i) => `${i + 1}. ${c.title} (${new Date(c.updatedAt).toLocaleString()})`).join('\n');
    const selection = prompt(`Select a course to load:\n\n${courseList}\n\nEnter number:`);

    if (selection) {
      const index = parseInt(selection) - 1;
      if (index >= 0 && index < courses.length) {
        const data = storageService.loadFromLocalStorage(courses[index].key);
        courseService.loadCourse(data);
        this.renderCourse();
        this.showMessage('Course loaded successfully!');
      }
    }
  }

  exportCourse() {
    const course = courseService.getCurrentCourse();
    if (!course) {
      alert('No course to export');
      return;
    }

    const filename = `${course.title.replace(/\s+/g, '_')}_${Date.now()}.json`;
    storageService.exportToFile(course.toJSON(), filename);
    this.showMessage('Course exported successfully!');
  }

  async importCourse() {
    try {
      const data = await storageService.importFromFile();
      courseService.loadCourse(data);
      this.renderCourse();
      this.showMessage('Course imported successfully!');
    } catch (error) {
      alert(`Failed to import: ${error.message}`);
    }
  }

  updateCourseTitle(title) {
    courseService.updateCourse({ title });
  }

  updateCourseDescription(description) {
    courseService.updateCourse({ description });
  }

  updateCourseAuthor(author) {
    courseService.updateCourse({ author });
  }

  addSection(contentType) {
    const plugin = registry.getPlugin(contentType);
    if (!plugin) {
      alert(`Unknown content type: ${contentType}`);
      return;
    }

    const section = courseService.addSection({
      title: `New ${plugin.displayName} Section`,
      contentType,
      content: {}
    });

    this.renderSections();
    this.editSection(section.id);
  }

  viewSection(sectionId) {
    const course = courseService.getCurrentCourse();
    const section = course.sections.find(s => s.id === sectionId);
    if (!section) return;

    this.currentSection = section;
    this.viewMode = 'view';
    this.renderSectionView();
    this.renderSections(); // Re-render to enable dragging
  }

  editSection(sectionId) {
    const course = courseService.getCurrentCourse();
    const section = course.sections.find(s => s.id === sectionId);
    if (!section) return;

    this.currentSection = section;
    this.viewMode = 'edit';
    this.renderSectionEditor(section);
    this.renderSections(); // Re-render to disable dragging
  }

  deleteSection(sectionId) {
    if (!confirm('Delete this section?')) return;

    courseService.deleteSection(sectionId);
    this.renderSections();

    if (this.currentSection && this.currentSection.id === sectionId) {
      this.currentSection = null;
      document.getElementById('section-editor').innerHTML = '<p class="no-selection">Select a section to edit</p>';
    }
  }

  moveSection(sectionId, direction) {
    const course = courseService.getCurrentCourse();
    const currentIndex = course.sections.findIndex(s => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= course.sections.length) return;

    courseService.moveSection(sectionId, newIndex);
    this.renderSections();
  }

  renderCourse() {
    const course = courseService.getCurrentCourse();
    if (!course) {
      this.newCourse();
      return;
    }

    document.getElementById('course-title').value = course.title;
    document.getElementById('course-description').value = course.description;
    document.getElementById('course-author').value = course.author;

    this.renderSections();
  }

  renderSections() {
    const course = courseService.getCurrentCourse();
    if (!course) return;

    // Only allow dragging when not in edit mode
    const isDraggable = this.viewMode !== 'edit';

    const container = document.getElementById('sections-list');
    container.innerHTML = course.sections.map((section, index) => {
      const plugin = registry.getPlugin(section.contentType);
      return `
        <div class="section-item ${this.currentSection?.id === section.id ? 'active' : ''}"
             data-id="${section.id}"
             draggable="${isDraggable}"
             onclick="app.viewSection('${section.id}')">
          <div class="section-header">
            ${isDraggable ? '<span class="drag-handle" title="Drag to reorder">⋮⋮</span>' : ''}
            <span class="section-icon">${plugin?.icon || '📄'}</span>
            <span class="section-title">${section.title}</span>
          </div>
          <div class="section-actions">
            <button class="btn-icon" onclick="event.stopPropagation(); app.moveSection('${section.id}', 'up')" ${index === 0 ? 'disabled' : ''} title="Move up">↑</button>
            <button class="btn-icon" onclick="event.stopPropagation(); app.moveSection('${section.id}', 'down')" ${index === course.sections.length - 1 ? 'disabled' : ''} title="Move down">↓</button>
            <button class="btn-icon btn-edit" onclick="event.stopPropagation(); app.editSection('${section.id}')" title="Edit">✏️</button>
            <button class="btn-icon btn-delete" onclick="event.stopPropagation(); app.deleteSection('${section.id}')" title="Delete">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Setup drag and drop handlers only when dragging is enabled
    if (isDraggable) {
      this.setupDragAndDrop();
    }
  }

  setupDragAndDrop() {
    const items = document.querySelectorAll('.section-item');
    let draggedItem = null;

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', item.innerHTML);
      });

      item.addEventListener('dragend', (e) => {
        item.classList.remove('dragging');
        draggedItem = null;
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedItem && draggedItem !== item) {
          const rect = item.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;

          if (e.clientY < midpoint) {
            item.classList.add('drag-over-top');
            item.classList.remove('drag-over-bottom');
          } else {
            item.classList.add('drag-over-bottom');
            item.classList.remove('drag-over-top');
          }
        }
      });

      item.addEventListener('dragleave', (e) => {
        item.classList.remove('drag-over-top', 'drag-over-bottom');
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();

        item.classList.remove('drag-over-top', 'drag-over-bottom');

        if (draggedItem && draggedItem !== item) {
          const course = courseService.getCurrentCourse();
          const draggedId = draggedItem.dataset.id;
          const targetId = item.dataset.id;

          const draggedIndex = course.sections.findIndex(s => s.id === draggedId);
          const targetIndex = course.sections.findIndex(s => s.id === targetId);

          if (draggedIndex !== -1 && targetIndex !== -1) {
            // Determine if we should insert before or after based on drop position
            const rect = item.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            let newIndex = targetIndex;

            if (e.clientY > midpoint && draggedIndex < targetIndex) {
              // Dropping below target, and dragged is above: use target index
              newIndex = targetIndex;
            } else if (e.clientY > midpoint && draggedIndex > targetIndex) {
              // Dropping below target, and dragged is below: insert after
              newIndex = targetIndex + 1;
            } else if (e.clientY < midpoint && draggedIndex > targetIndex) {
              // Dropping above target, and dragged is below: use target index
              newIndex = targetIndex;
            } else if (e.clientY < midpoint && draggedIndex < targetIndex) {
              // Dropping above target, and dragged is above: insert before
              newIndex = targetIndex - 1;
            }

            courseService.moveSection(draggedId, newIndex);
            this.renderSections();
            this.showMessage('Section reordered');
          }
        }
      });
    });
  }

  renderSectionEditor(section) {
    const plugin = registry.getPlugin(section.contentType);
    if (!plugin) {
      alert(`Plugin not found for type: ${section.contentType}`);
      return;
    }

    const container = document.getElementById('section-editor');
    container.className = 'section-editor editor-mode';
    container.innerHTML = `
      <div class="mode-indicator edit-mode-indicator">
        <span class="mode-icon">✏️</span>
        <span class="mode-label">EDIT MODE</span>
      </div>
      <div class="section-editor-header">
        <input
          type="text"
          id="section-title-input"
          class="section-title-input"
          value="${section.title}"
          placeholder="Section title" />
        <div class="section-meta">
          <span class="section-type-badge">${plugin.icon} ${plugin.displayName}</span>
        </div>
      </div>
      <div id="section-content-editor"></div>
      <div class="section-editor-actions">
        <button id="save-section-btn" class="btn-primary">💾 Save Changes</button>
        <button id="preview-section-btn" class="btn-secondary">👁️ Preview</button>
      </div>
    `;

    const titleInput = document.getElementById('section-title-input');
    titleInput.addEventListener('input', (e) => {
      courseService.updateSection(section.id, { title: e.target.value });
      this.renderSections();
    });

    const contentEditor = document.getElementById('section-content-editor');
    plugin.renderEditor(contentEditor, section.content, (newContent) => {
      section.content = newContent;
    });

    document.getElementById('save-section-btn').addEventListener('click', () => {
      courseService.updateSection(section.id, { content: section.content });
      this.showMessage('Section saved!');
    });

    document.getElementById('preview-section-btn').addEventListener('click', () => {
      courseService.updateSection(section.id, { content: section.content });
      this.viewMode = 'view';
      this.renderSectionView();
    });
  }


  renderSectionView() {
    if (!this.currentSection) return;

    const plugin = registry.getPlugin(this.currentSection.contentType);
    if (!plugin) return;

    const container = document.getElementById('section-editor');
    container.className = 'section-editor view-mode';
    container.innerHTML = `
      <div class="mode-indicator view-mode-indicator">
        <span class="mode-icon">👁️</span>
        <span class="mode-label">VIEW MODE</span>
      </div>
      <div class="section-view-header">
        <h2>${this.currentSection.title}</h2>
        <div class="section-view-meta">
          <span class="section-type-badge">${plugin.icon} ${plugin.displayName}</span>
          <button id="edit-current-section-btn" class="btn-edit-inline">✏️ Edit Section</button>
        </div>
      </div>
      <div id="section-content-view" class="section-content-view"></div>
    `;

    const contentView = document.getElementById('section-content-view');
    plugin.renderView(contentView, this.currentSection.content);

    document.getElementById('edit-current-section-btn').addEventListener('click', () => {
      this.editSection(this.currentSection.id);
    });
  }

  exportCurrentSection() {
    if (!this.currentSection) {
      alert('No section selected');
      return;
    }

    const filename = `${this.currentSection.title.replace(/\s+/g, '_')}_${Date.now()}.json`;
    storageService.exportToFile(this.currentSection.toJSON(), filename);
    this.showMessage('Section exported successfully!');
  }

  tryLoadLastCourse() {
    const courses = storageService.listSavedCourses();
    if (courses.length > 0) {
      const lastCourse = storageService.loadFromLocalStorage(courses[0].key);
      courseService.loadCourse(lastCourse);
      this.renderCourse();
    } else {
      this.newCourse();
    }
  }

  showMessage(message) {
    const msgEl = document.getElementById('message');
    msgEl.textContent = message;
    msgEl.classList.add('show');
    setTimeout(() => msgEl.classList.remove('show'), 3000);
  }
}

// Create and export app instance
export const app = new App();

// Make app globally accessible for inline event handlers
window.app = app;
