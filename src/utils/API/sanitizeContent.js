/**
 * Sanitizes a content string field from API responses.
 *
 * Only fixes characters that cause real processing issues:
 *   - Single/double quotes  -> break JSON re-serialization / template engines
 *   - Backslash             -> corrupts JSON escape sequences when re-serialized
 *   - C0 control characters -> invalid in JSON strings and many storage layers
 *   - Zero-width / invisible Unicode -> silent display bugs
 *       (U+00AD soft-hyphen, U+200B zero-width space, U+200C/D joiners, U+FEFF BOM)
 *   - Unicode directional marks / overrides -> RTL spoofing
 *       (U+200E/F marks, U+202A-U+202E embeddings, U+2066-U+2069 isolates)
 *
 * Everything else is preserved unchanged: Unicode languages (Hindi/Tamil/Arabic/
 * Chinese/Japanese/Korean/Russian/Greek/Hebrew), emoji, extended ASCII (c R TM +/-),
 * regular ASCII punctuation (! @ # $ % ^ & * ( ) - _ + = [ ] { } | ~ ` ; : , . ? / < >).
 */
export const sanitizeContentField = (value) => {
  if (typeof value !== 'string') return value;

  return value
    // C0 control characters (NUL-US) except tab \x09, LF \x0A, CR \x0D
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Zero-width / invisible chars: soft-hyphen U+00AD, zero-width space U+200B,
    // zero-width non-joiner U+200C, zero-width joiner U+200D, BOM U+FEFF
    .replace(/[\u00AD\u200B\u200C\u200D\uFEFF]/g, '')
    // Directional marks (U+200E, U+200F), embeddings/overrides (U+202A-U+202E),
    // isolates (U+2066-U+2069)
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
    // Backslash - corrupts JSON escape sequences when re-serialized
    .replace(/\\/g, ' ')
    // Single and double quotes - break JSON strings and some template engines
    .replace(/['"]/g, ' ');
};

export const sanitizeContentObject = (content) => {
  if (!content) return content;

  if (content.name && typeof content.name === 'string') {
    content.name = sanitizeContentField(content.name);
  }

  if (content.description && typeof content.description === 'string') {
    content.description = sanitizeContentField(content.description);
  }

  if (content.keywords && Array.isArray(content.keywords)) {
    content.keywords = content.keywords.map((keyword) =>
      sanitizeContentField(keyword)
    );
  }

  return content;
};
