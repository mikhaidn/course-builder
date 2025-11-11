# Architecture: Educational Content Standard

## Vision: Modular Educational Content Standard (MECS)

This project implements a **separate, versioned open standard** for structured educational content. The standard should be framework-agnostic and enable interoperability between different educational platforms.

## Architectural Principles

### 1. Separation of Concerns

```
┌─────────────────────────────────────┐
│  Modular Educational Content        │
│  Standard (MECS)                    │
│  - JSON Schema Specification        │
│  - Version: 1.0.0                   │
│  - Hosted separately                │
└──────────────┬──────────────────────┘
               │ implements
               ↓
┌─────────────────────────────────────┐
│  Course Builder (this project)      │
│  - Validates against MECS           │
│  - Renders MECS content             │
│  - Exports/imports MECS format      │
└─────────────────────────────────────┘
```

### 2. Standard Repository Structure (Separate Project)

**Recommended structure for `mecs-standard` repo:**

```
mecs-standard/
├── schema/
│   ├── v1.0/
│   │   ├── course.schema.json       # Course structure
│   │   ├── section.schema.json      # Section/module structure
│   │   ├── content-types/           # Extensible content types
│   │   │   ├── text.schema.json
│   │   │   ├── video.schema.json
│   │   │   ├── document.schema.json
│   │   │   ├── quiz.schema.json     # Future
│   │   │   ├── assignment.schema.json
│   │   │   └── interactive.schema.json
│   │   └── metadata.schema.json     # Common metadata
│   └── v2.0/                         # Future versions
├── examples/
│   ├── basic-course.json
│   └── advanced-course.json
├── docs/
│   ├── specification.md
│   ├── extension-guide.md
│   └── implementation-guide.md
├── validators/
│   ├── javascript/
│   ├── python/
│   └── java/
└── README.md
```

### 3. Extension Points

The standard should define clear extension points:

#### A. Content Type Extension
```json
{
  "contentType": "custom:interactive-simulation",
  "contentSchema": "https://example.com/schemas/simulation.json",
  "content": {
    "type": "physics-lab",
    "config": { ... }
  }
}
```

#### B. Metadata Extension
```json
{
  "metadata": {
    "standardVersion": "1.0.0",
    "extensions": {
      "grading": "https://example.com/extensions/grading.json",
      "lti": "https://example.com/extensions/lti.json"
    }
  }
}
```

#### C. Assessment Extension
```json
{
  "assessments": {
    "quizzes": [...],
    "assignments": [...],
    "rubrics": [...]
  }
}
```

## Current Implementation Alignment

### What We Have Now (Good Foundation)
- ✅ Modular plugin architecture
- ✅ JSON-based course format
- ✅ Clear content type abstraction
- ✅ Export/import capability

### What We Need to Add (For Standard Compliance)

1. **Schema Validation**
   - Add JSON Schema validation
   - Versioning in exported JSON
   - Migration tools between versions

2. **Namespace/Registry System**
   - Core content types: `mecs:text`, `mecs:video`, `mecs:document`
   - Custom types: `org.example:custom-type`
   - Plugin discovery and loading

3. **Metadata Standard**
   - Learning objectives
   - Difficulty level
   - Prerequisites
   - Time estimates
   - Tags/categorization

4. **Interoperability**
   - LTI integration points
   - SCORM compatibility layer
   - IMS Common Cartridge export

## Recommended Roadmap

### Phase 1: Define Core Standard (Separate Repo)
1. Create `mecs-standard` repository
2. Define JSON Schema for:
   - Course structure
   - Section/module
   - Core content types (text, video, document)
3. Write specification document
4. Create validator library

### Phase 2: Refactor This Project
1. Import MECS schema as dependency/submodule
2. Add schema validation on import/export
3. Update JSON format to match standard
4. Add version field to all exports

### Phase 3: Extend Standard
1. Add quiz/assessment schemas
2. Add assignment schemas
3. Add grading/rubric schemas
4. Add discussion/collaboration schemas

### Phase 4: Ecosystem
1. Create validator libraries (JS, Python, Java)
2. Create converter tools (SCORM, LTI, Markdown)
3. Build reference implementations
4. Encourage community plugins

## Implementation Strategy for This Project

### Option A: Git Submodule (Recommended)
```bash
# In mecs-standard repo
git clone https://github.com/yourorg/mecs-standard.git

# In this repo
git submodule add https://github.com/yourorg/mecs-standard.git schema/mecs-standard
```

**Pros:**
- Clear separation
- Version pinning
- Easy updates
- Single source of truth

### Option B: NPM Package
```bash
npm install @mecs/standard
```

**Pros:**
- Familiar to developers
- Automatic versioning
- Easy dependency management

### Option C: Remote Schema References
```json
{
  "$schema": "https://mecs-standard.org/schema/v1.0/course.schema.json"
}
```

**Pros:**
- Always latest schema
- No local dependencies
- Web-native

## Next Steps

1. **Create separate `mecs-standard` repository**
2. **Define v1.0 JSON Schema**
3. **Add schema reference to this project**
4. **Implement validation layer**
5. **Document extension process**

## Benefits of This Approach

- 🔌 **Pluggable**: Anyone can create content type plugins
- 🔄 **Interoperable**: Courses work across different platforms
- 📦 **Portable**: Standard JSON format
- 🎯 **Focused**: Standard focuses on spec, implementations focus on UX
- 🚀 **Scalable**: Easy to add quizzes, grading, analytics later
- 🌐 **Open**: Community-driven evolution
