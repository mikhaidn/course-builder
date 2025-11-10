# MECS Draft Schema (v1.0.0-draft)

**Modular Educational Content Standard**

This directory contains a **draft** of the MECS schema that will eventually be moved to a separate repository.

## Purpose

Define an **open, interoperable standard** for educational content that:
- Works across different platforms and tools
- Supports modular, reusable content
- Enables rich metadata and learning analytics
- Allows ecosystem-wide innovation through extensions

## Current Status: DRAFT

This is a working draft to:
1. Validate the concept
2. Test with this Course Builder implementation
3. Gather feedback before creating separate repo

## Files

- `course.schema.json` - Top-level course structure
- `section.schema.json` - Individual section/module structure
- `content-types/` - Schemas for specific content types

## Key Concepts

### 1. Namespaced Content Types

Content types use namespaces to avoid conflicts:

```
mecs:text           # Core standard types
mecs:video
mecs:document
mecs:quiz

custom:simulation   # Custom types
acme:interactive
```

### 2. Versioning

Every document includes `mecsVersion`:

```json
{
  "mecsVersion": "1.0.0",
  "type": "mecs:course",
  ...
}
```

### 3. Extension Points

Standard defines extension points for:
- Custom metadata
- Custom content types
- Assessment types
- Learning analytics
- LMS integration

## Migration Path

### Current Format → MECS Format

**Current:**
```json
{
  "id": "course_123",
  "title": "Calculus I",
  "author": "Dr. Smith",
  "sections": [...]
}
```

**MECS:**
```json
{
  "mecsVersion": "1.0.0",
  "type": "mecs:course",
  "id": "course_123",
  "title": "Calculus I",
  "metadata": {
    "author": "Dr. Smith"
  },
  "sections": [...]
}
```

## Next Steps

1. **Validate**: Use in Course Builder
2. **Iterate**: Gather feedback and refine
3. **Separate**: Move to dedicated `mecs-standard` repository
4. **Publish**: Release v1.0.0 specification
5. **Ecosystem**: Build tools, validators, converters

## Contributing

This is a draft! Feedback welcome on:
- Schema structure
- Metadata fields
- Extension mechanisms
- Content type definitions

## Future Content Types

Planned for future versions:
- `mecs:quiz` - Interactive quizzes
- `mecs:assignment` - Homework/projects
- `mecs:discussion` - Threaded discussions
- `mecs:interactive` - Interactive simulations
- `mecs:assessment` - Formal assessments
- `mecs:scorm` - SCORM package reference
