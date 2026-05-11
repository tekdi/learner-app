import {
  sanitizeContentField,
  sanitizeContentObject,
} from '../src/utils/API/sanitizeContent';

// ---------------------------------------------------------------------------
// sanitizeContentField
// ---------------------------------------------------------------------------

describe('sanitizeContentField – non-string passthrough', () => {
  test('returns number unchanged', () => expect(sanitizeContentField(42)).toBe(42));
  test('returns null unchanged', () => expect(sanitizeContentField(null)).toBeNull());
  test('returns undefined unchanged', () => expect(sanitizeContentField(undefined)).toBeUndefined());
  test('returns array unchanged', () => {
    const a = [1, 2];
    expect(sanitizeContentField(a)).toBe(a);
  });
});

// ---------------------------------------------------------------------------
// Single / double quotes
// ---------------------------------------------------------------------------
describe('sanitizeContentField – quotes', () => {
  test("replaces single quote with space", () =>
    expect(sanitizeContentField("Course 'Demo' Test")).toBe('Course  Demo  Test'));
  test('replaces double quote with space', () =>
    expect(sanitizeContentField('Course "Demo" Test')).toBe('Course  Demo  Test'));
  test('replaces both quote types', () =>
    expect(sanitizeContentField(`It's a "test"`)).toBe('It s a  test '));
  test('handles string with only quotes', () =>
    expect(sanitizeContentField(`'"`)).toBe('  '));
});

// ---------------------------------------------------------------------------
// Backslash
// ---------------------------------------------------------------------------
describe('sanitizeContentField – backslash', () => {
  test('replaces backslash with space', () =>
    expect(sanitizeContentField('A\\B')).toBe('A B'));
  test('replaces multiple backslashes', () =>
    expect(sanitizeContentField('A\\\\B')).toBe('A  B'));
});

// ---------------------------------------------------------------------------
// Control characters
// ---------------------------------------------------------------------------
describe('sanitizeContentField – control characters', () => {
  test('removes NUL (\\x00)', () =>
    expect(sanitizeContentField('AB\x00CD')).toBe('ABCD'));
  test('removes BEL (\\x07)', () =>
    expect(sanitizeContentField('AB\x07CD')).toBe('ABCD'));
  test('removes \\x1F (unit separator)', () =>
    expect(sanitizeContentField('AB\x1FCD')).toBe('ABCD'));
  test('removes DEL (\\x7F)', () =>
    expect(sanitizeContentField('AB\x7FCD')).toBe('ABCD'));
  test('preserves tab (\\x09)', () =>
    expect(sanitizeContentField('AB\x09CD')).toBe('AB\tCD'));
  test('preserves LF (\\x0A)', () =>
    expect(sanitizeContentField('AB\x0ACD')).toBe('AB\nCD'));
  test('preserves CR (\\x0D)', () =>
    expect(sanitizeContentField('AB\x0DCD')).toBe('AB\rCD'));
});

// ---------------------------------------------------------------------------
// Zero-width / invisible Unicode
// ---------------------------------------------------------------------------
describe('sanitizeContentField – zero-width / invisible chars', () => {
  test('removes soft-hyphen U+00AD', () =>
    expect(sanitizeContentField('ABC­DEF')).toBe('ABCDEF'));
  test('removes zero-width space U+200B', () =>
    expect(sanitizeContentField('ABC​DEF')).toBe('ABCDEF'));
  test('removes zero-width non-joiner U+200C', () =>
    expect(sanitizeContentField('ABC‌DEF')).toBe('ABCDEF'));
  test('removes zero-width joiner U+200D', () =>
    expect(sanitizeContentField('ABC‍DEF')).toBe('ABCDEF'));
  test('removes BOM U+FEFF', () =>
    expect(sanitizeContentField('﻿ABC')).toBe('ABC'));
});

// ---------------------------------------------------------------------------
// Directional / RTL override characters
// ---------------------------------------------------------------------------
describe('sanitizeContentField – directional override chars', () => {
  test('removes LTR mark U+200E', () =>
    expect(sanitizeContentField('AB\u200ECD')).toBe('ABCD'));
  test('removes RTL mark U+200F', () =>
    expect(sanitizeContentField('AB\u200FCD')).toBe('ABCD'));
  test('removes LTR embedding U+202A', () =>
    expect(sanitizeContentField('AB\u202ACD')).toBe('ABCD'));
  test('removes RTL embedding U+202B', () =>
    expect(sanitizeContentField('AB\u202BCD')).toBe('ABCD'));
  test('removes RTL override U+202E', () =>
    expect(sanitizeContentField('AB\u202ECD')).toBe('ABCD'));
  test('removes LTR isolate U+2066', () =>
    expect(sanitizeContentField('AB\u2066CD')).toBe('ABCD'));
  test('removes first strong isolate U+2068', () =>
    expect(sanitizeContentField('AB\u2068CD')).toBe('ABCD'));
  test('removes pop directional isolate U+2069', () =>
    expect(sanitizeContentField('AB\u2069CD')).toBe('ABCD'));
});

// ---------------------------------------------------------------------------
// ASCII special characters – must be PRESERVED
// ---------------------------------------------------------------------------
describe('sanitizeContentField – ASCII special chars preserved', () => {
  const specialChars = '! @ # $ % ^ & * ( ) - _ + = [ ] { } < > | ~ ` ; : , . ? /';
  test('preserves all ASCII punctuation', () =>
    expect(sanitizeContentField(specialChars)).toBe(specialChars));
  test('Maths & Science: Grade-5', () =>
    expect(sanitizeContentField('Maths & Science: Grade-5')).toBe('Maths & Science: Grade-5'));
  test('100% Complete Course', () =>
    expect(sanitizeContentField('100% Complete Course')).toBe('100% Complete Course'));
  test('A/B Testing Course', () =>
    expect(sanitizeContentField('A/B Testing Course')).toBe('A/B Testing Course'));
  test('Name_with_underscores-and-hyphens', () =>
    expect(sanitizeContentField('Name_with_underscores-and-hyphens'))
      .toBe('Name_with_underscores-and-hyphens'));
  test('<script>alert(1)</script> preserved (plain text)', () =>
    expect(sanitizeContentField('<script>alert(1)</script>'))
      .toBe('<script>alert(1)</script>'));
  test('HTML entities &nbsp; &amp; &lt; &gt; preserved', () =>
    expect(sanitizeContentField('&nbsp; &amp; &lt; &gt;'))
      .toBe('&nbsp; &amp; &lt; &gt;'));
});

// ---------------------------------------------------------------------------
// Extended ASCII – must be PRESERVED
// ---------------------------------------------------------------------------
describe('sanitizeContentField – extended ASCII preserved', () => {
  test('preserves copyright ©', () =>
    expect(sanitizeContentField('© 2024')).toBe('© 2024'));
  test('preserves registered ®', () =>
    expect(sanitizeContentField('Brand®')).toBe('Brand®'));
  test('preserves trademark ™', () =>
    expect(sanitizeContentField('Logo™')).toBe('Logo™'));
  test('preserves ± § ¶ µ ÷ × ¢ £ ¥ €', () =>
    expect(sanitizeContentField('± § ¶ µ ÷ × ¢ £ ¥ €'))
      .toBe('± § ¶ µ ÷ × ¢ £ ¥ €'));
});

// ---------------------------------------------------------------------------
// Unicode language characters – must be PRESERVED
// ---------------------------------------------------------------------------
describe('sanitizeContentField – Unicode languages preserved', () => {
  test('preserves Hindi/Marathi', () =>
    expect(sanitizeContentField('अ आ इ ई उ ऊ ए ऐ ओ औ क ख ग ज्ञ श्र'))
      .toBe('अ आ इ ई उ ऊ ए ऐ ओ औ क ख ग ज्ञ श्र'));
  test('preserves Tamil', () =>
    expect(sanitizeContentField('அ ஆ இ ஈ உ ஊ')).toBe('அ ஆ இ ஈ உ ஊ'));
  test('preserves Telugu', () =>
    expect(sanitizeContentField('అ ఆ ఇ ఈ ఉ ఊ')).toBe('అ ఆ ఇ ఈ ఉ ఊ'));
  test('preserves Kannada', () =>
    expect(sanitizeContentField('ಅ ಆ ಇ ಈ ಉ ಊ')).toBe('ಅ ಆ ಇ ಈ ಉ ಊ'));
  test('preserves Bengali', () =>
    expect(sanitizeContentField('অ আ ই ঈ উ ঊ')).toBe('অ আ ই ঈ উ ঊ'));
  test('preserves Gujarati', () =>
    expect(sanitizeContentField('અ આ ઇ ઈ ઉ ઊ')).toBe('અ આ ઇ ઈ ઉ ઊ'));
  test('preserves Punjabi', () =>
    expect(sanitizeContentField('ਅ ਆ ਇ ਈ ਉ ਊ')).toBe('ਅ ਆ ਇ ਈ ਉ ਊ'));
  test('preserves Urdu/Arabic', () =>
    expect(sanitizeContentField('ا ب ت ث ج ح خ')).toBe('ا ب ت ث ج ح خ'));
  test('preserves Chinese', () =>
    expect(sanitizeContentField('你好中国')).toBe('你好中国'));
  test('preserves Japanese', () =>
    expect(sanitizeContentField('こんにちは日本')).toBe('こんにちは日本'));
  test('preserves Korean', () =>
    expect(sanitizeContentField('안녕하세요 한국')).toBe('안녕하세요 한국'));
  test('preserves Russian', () =>
    expect(sanitizeContentField('Привет Россия')).toBe('Привет Россия'));
  test('preserves Greek', () =>
    expect(sanitizeContentField('α β γ δ Ω')).toBe('α β γ δ Ω'));
  test('preserves Hebrew', () =>
    expect(sanitizeContentField('שלום עולם')).toBe('שלום עולם'));
  test('नाम वाला Course', () =>
    expect(sanitizeContentField('नाम वाला Course')).toBe('नाम वाला Course'));
  test('课程测试-日本語', () =>
    expect(sanitizeContentField('课程测试-日本語')).toBe('课程测试-日本語'));
});

// ---------------------------------------------------------------------------
// Unicode symbols – must be PRESERVED
// ---------------------------------------------------------------------------
describe('sanitizeContentField – Unicode symbols preserved', () => {
  test('preserves check/cross marks', () =>
    expect(sanitizeContentField('✓ ✔ ✕ ✖')).toBe('✓ ✔ ✕ ✖'));
  test('preserves stars and hearts', () =>
    expect(sanitizeContentField('★ ☆ ♥ ❤')).toBe('★ ☆ ♥ ❤'));
  test('preserves weather/misc symbols', () =>
    expect(sanitizeContentField('☺ ☹ ☀ ☁ ☂ ☕ ♫ ♪')).toBe('☺ ☹ ☀ ☁ ☂ ☕ ♫ ♪'));
});

// ---------------------------------------------------------------------------
// Emoji – must be PRESERVED
// ---------------------------------------------------------------------------
describe('sanitizeContentField – emoji preserved', () => {
  test('preserves common emoji', () =>
    expect(sanitizeContentField('😀 😁 😂 🤖 🚀 🎉 📚 ❤️ 👍 🔥'))
      .toBe('😀 😁 😂 🤖 🚀 🎉 📚 ❤️ 👍 🔥'));
  test('Hello 😀 🚀', () =>
    expect(sanitizeContentField('Hello 😀 🚀')).toBe('Hello 😀 🚀'));
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------
describe('sanitizeContentField – edge cases', () => {
  test('empty string returns empty string', () =>
    expect(sanitizeContentField('')).toBe(''));
  test('string with only spaces unchanged', () =>
    expect(sanitizeContentField('   ')).toBe('   '));
  test('very long string is handled', () => {
    const long = 'A'.repeat(10000);
    expect(sanitizeContentField(long)).toBe(long);
  });
  test('multiple consecutive special chars', () =>
    expect(sanitizeContentField(`'''"""`)).toBe('      '));
  test('mixed language + emoji + symbols', () =>
    expect(sanitizeContentField('नाम ★ 😀 © Hello')).toBe('नाम ★ 😀 © Hello'));
  test('mixed language + problematic chars', () =>
    expect(sanitizeContentField(`नाम 'Demo' ​ test`)).toBe('नाम  Demo   test'));
  test('JSON-like string with quotes replaced', () =>
    expect(sanitizeContentField('{"key":"value"}')).toBe('{ key : value }'));
  test('SQL-like string with quotes replaced', () =>
    expect(sanitizeContentField("SELECT * FROM table WHERE name='test'"))
      .toBe('SELECT * FROM table WHERE name= test '));
  test('multi-line text preserved', () =>
    expect(sanitizeContentField('Line1\nLine2\nLine3')).toBe('Line1\nLine2\nLine3'));
});

// ---------------------------------------------------------------------------
// sanitizeContentObject
// ---------------------------------------------------------------------------
describe('sanitizeContentObject', () => {
  test('sanitizes name, description, and keywords', () => {
    const content = {
      name: `Course "Demo" Test`,
      description: `It's a great course`,
      keywords: [`tag'1`, 'normal', `tag"2`],
    };
    sanitizeContentObject(content);
    expect(content.name).toBe('Course  Demo  Test');
    expect(content.description).toBe('It s a great course');
    expect(content.keywords).toEqual(['tag 1', 'normal', 'tag 2']);
  });

  test('skips missing fields', () => {
    const content = { name: 'Valid' };
    sanitizeContentObject(content);
    expect(content.name).toBe('Valid');
    expect(content.description).toBeUndefined();
    expect(content.keywords).toBeUndefined();
  });

  test('skips non-string keywords array items', () => {
    const content = { keywords: ['tag', 42, null] };
    sanitizeContentObject(content);
    expect(content.keywords).toEqual(['tag', 42, null]);
  });

  test('returns null unchanged', () =>
    expect(sanitizeContentObject(null)).toBeNull());

  test('returns undefined unchanged', () =>
    expect(sanitizeContentObject(undefined)).toBeUndefined());

  test('handles zero-width chars in content object', () => {
    const content = {
      name: 'Course​Name',
      description: 'Desc﻿',
      keywords: ['tag​'],
    };
    sanitizeContentObject(content);
    expect(content.name).toBe('CourseName');
    expect(content.description).toBe('Desc');
    expect(content.keywords).toEqual(['tag']);
  });

  test('preserves Unicode languages in all fields', () => {
    const content = {
      name: 'नाम वाला Course',
      description: '课程测试 description',
      keywords: ['தமிழ்', 'hello'],
    };
    sanitizeContentObject(content);
    expect(content.name).toBe('नाम वाला Course');
    expect(content.description).toBe('课程测试 description');
    expect(content.keywords).toEqual(['தமிழ்', 'hello']);
  });
});
