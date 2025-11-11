# Implementing the MECS Standard

## Overview

This document describes how Course Builder implements the Modular Educational Content Standard (MECS).

## Architecture Layers

```
┌─────────────────────────────────────────┐
│  UI Layer (ui/)                         │
│  - User interactions                    │
│  - Rendering                            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Service Layer (services/)              │
│  - Business logic                       │
│  - MECS adapter (converts formats)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Core Layer (core/)                     │
│  - Domain models (internal format)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  MECS Standard (schema/)                │
│  - JSON Schema validation               │
│  - Import/Export format                 │
└─────────────────────────────────────────┘
```

## Implementation Strategy

### Phase 1: Add MECS Adapter (Next Step)

Create `services/mecsAdapter.js`:

```javascript
/**
 * Converts between internal format and MECS standard
 */
export class MECSAdapter {

  // Convert internal Course to MECS format
  toMECS(course) {
    return {
      mecsVersion: "1.0.0",
      type: "mecs:course",
      id: course.id,
      title: course.title,
      description: course.description,
      metadata: {
        author: course.author,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      },
      sections: course.sections.map(s => this.sectionToMECS(s))
    };
  }

  // Convert MECS format to internal Course
  fromMECS(mecsData) {
    return {
      id: mecsData.id,
      title: mecsData.title,
      description: mecsData.description,
      author: mecsData.metadata?.author || '',
      createdAt: mecsData.metadata?.createdAt || mecsData.createdAt,
      updatedAt: mecsData.metadata?.updatedAt || mecsData.updatedAt,
      sections: mecsData.sections.map(s => this.sectionFromMECS(s))
    };
  }

  sectionToMECS(section) {
    return {
      id: section.id,
      title: section.title,
      order: section.order,
      contentType: this.mapContentType(section.contentType),
      content: section.content,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt
    };
  }

  sectionFromMECS(mecsSection) {
    return {
      id: mecsSection.id,
      title: mecsSection.title,
      order: mecsSection.order,
      contentType: this.unmapContentType(mecsSection.contentType),
      content: mecsSection.content,
      createdAt: mecsSection.createdAt,
      updatedAt: mecsSection.updatedAt
    };
  }

  // Map internal type names to MECS namespaced types
  mapContentType(type) {
    const mapping = {
      'markdown': 'mecs:text',
      'video': 'mecs:video',
      'document': 'mecs:document'
    };
    return mapping[type] || `custom:${type}`;
  }

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

    return mecsType;
  }

  // Validate against MECS schema
  async validate(mecsData) {
    // TODO: Implement JSON Schema validation
    // Can use libraries like Ajv
    return true;
  }
}
```

### Phase 2: Update Storage Service

Modify `services/storageService.js` to use adapter:

```javascript
import { MECSAdapter } from './mecsAdapter.js';

export class StorageService {
  constructor() {
    this.adapter = new MECSAdapter();
  }

  exportToFile(course, filename) {
    // Convert to MECS format before export
    const mecsData = this.adapter.toMECS(course);
    const json = JSON.stringify(mecsData, null, 2);
    // ... rest of export logic
  }

  async importFromFile() {
    const data = await /* ... read file */;

    // Check if it's MECS format
    if (data.mecsVersion) {
      return this.adapter.fromMECS(data);
    }

    // Otherwise, try legacy format
    return data;
  }
}
```

### Phase 3: Content Type Plugin Updates

Update plugin registration to use namespaces:

```javascript
// config/contentTypeRegistry.js
export default {
  type: 'markdown',  // Internal name
  mecsType: 'mecs:text',  // MECS standard name
  displayName: 'Markdown Text',
  // ... rest of plugin
};
```

## Benefits

### For Users
- Export courses that work in other MECS-compatible systems
- Import courses from other platforms
- Future-proof content

### For Developers
- Clear standard to implement against
- Plugin ecosystem across platforms
- Validation tools available
- Migration paths defined

### For Ecosystem
- Interoperability between tools
- Shared content libraries
- Community-driven evolution
- Multiple implementations (web, mobile, desktop)

## Roadmap

### ✅ Phase 0: Foundation (Current)
- Core plugin architecture
- JSON import/export
- Modular design

### 🔄 Phase 1: MECS Adapter (Next)
- Add MECS adapter layer
- Update export to MECS format
- Backward compatibility with current format

### 📋 Phase 2: Schema Validation
- Add JSON Schema validator
- Validate on import/export
- Provide helpful error messages

### 🚀 Phase 3: Separate Standard Repo
- Move schema to `mecs-standard` repository
- Reference as submodule or package
- Version schema independently

### 🌐 Phase 4: Extended Content Types
- Implement `mecs:quiz`
- Implement `mecs:assignment`
- Community plugin registry

## Example: MECS Course Export

When you export a course, it will look like:

```json
{
  "mecsVersion": "1.0.0",
  "type": "mecs:course",
  "id": "course_calculus_i",
  "title": "Calculus I",
  "description": "Introduction to differential and integral calculus",
  "metadata": {
    "author": "Dr. Jane Smith",
    "institution": "Example University",
    "subject": "Mathematics",
    "level": "undergraduate",
    "language": "en",
    "duration": { "value": 15, "unit": "weeks" },
    "prerequisites": ["Algebra II", "Trigonometry"],
    "learningObjectives": [
      "Understand limits and continuity",
      "Calculate derivatives",
      "Solve optimization problems"
    ],
    "tags": ["calculus", "mathematics", "STEM"],
    "license": "CC-BY-4.0"
  },
  "sections": [
    {
      "id": "section_001",
      "title": "Introduction to Limits",
      "order": 0,
      "contentType": "mecs:text",
      "content": {
        "format": "markdown",
        "text": "# Limits\n\nA limit describes..."
      },
      "metadata": {
        "duration": { "value": 30, "unit": "minutes" },
        "difficulty": "medium"
      }
    },
    {
      "id": "section_002",
      "title": "Limits Explained",
      "order": 1,
      "contentType": "mecs:video",
      "content": {
        "url": "https://youtube.com/watch?v=...",
        "provider": "youtube",
        "title": "Understanding Limits"
      }
    }
  ]
}
```

## Questions to Answer

1. **Should we support both formats?**
   - Yes, during transition period
   - Export as MECS, import both

2. **How to handle custom plugins?**
   - Use `custom:` namespace
   - Document in extensions field

3. **Validation strategy?**
   - Validate on import (strict)
   - Warn on export (helpful)

4. **Version migration?**
   - Auto-migrate legacy → MECS v1.0
   - Future: migration tools for v1 → v2

## Getting Started

To start implementing MECS in your own project:

1. Reference the schema in `schema/mecs-draft/`
2. Implement the adapter pattern shown above
3. Validate against JSON Schema
4. Contribute improvements back!
