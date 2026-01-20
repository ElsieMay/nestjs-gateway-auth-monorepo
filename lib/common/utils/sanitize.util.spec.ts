import {
  sanitiseString,
  encodeHtmlEntities,
  sanitiseObject,
} from './sanitise.util';

describe('Sanitisation Utilities', () => {
  describe('sanitiseString', () => {
    it('should remove script tags', () => {
      const malicious = '<script>alert("XSS")</script>Hello';
      const result = sanitiseString(malicious);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove HTML tags', () => {
      const html = '<div>Hello <b>World</b></div>';
      const result = sanitiseString(html);
      expect(result).not.toContain('<div>');
      expect(result).not.toContain('<b>');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('should handle img tags with onerror', () => {
      const malicious = '<img src=x onerror="alert(1)">';
      const result = sanitiseString(malicious);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert');
    });

    it('should preserve plain text', () => {
      const text = 'Hello World 123';
      const result = sanitiseString(text);
      expect(result).toBe(text);
    });

    it('should handle empty strings', () => {
      const result = sanitiseString('');
      expect(result).toBe('');
    });

    it('should handle javascript: protocol', () => {
      const malicious = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitiseString(malicious);
      expect(result).not.toContain('javascript:');
    });
  });

  describe('encodeHtmlEntities', () => {
    it('should encode ampersands', () => {
      const result = encodeHtmlEntities('Tom & Jerry');
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should encode less than and greater than', () => {
      const result = encodeHtmlEntities('<div>Test</div>');
      expect(result).toBe('&lt;div&gt;Test&lt;&#x2F;div&gt;');
    });

    it('should encode quotes', () => {
      const result = encodeHtmlEntities('He said "Hello"');
      expect(result).toBe('He said &quot;Hello&quot;');
    });

    it('should encode single quotes', () => {
      const result = encodeHtmlEntities("It's working");
      expect(result).toBe('It&#x27;s working');
    });

    it('should encode forward slashes', () => {
      const result = encodeHtmlEntities('</script>');
      expect(result).toBe('&lt;&#x2F;script&gt;');
    });

    it('should handle multiple special characters', () => {
      const result = encodeHtmlEntities('<script>alert("XSS")</script>');
      expect(result).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;',
      );
    });
  });

  describe('sanitiseObject', () => {
    it('should sanitise all string properties', () => {
      const obj = {
        name: '<script>alert("XSS")</script>John',
        email: 'john@example.com',
        bio: '<div>Hello</div>',
      };
      const result = sanitiseObject(obj);
      expect(result.name).not.toContain('<script>');
      expect(result.email).toBe('john@example.com');
      expect(result.bio).not.toContain('<div>');
    });

    it('should handle nested objects', () => {
      const obj = {
        user: {
          name: '<b>John</b>',
          profile: {
            bio: '<script>alert(1)</script>',
          },
        },
      };
      const result = sanitiseObject(obj);
      expect(result.user.name).not.toContain('<b>');
      expect(result.user.profile.bio).not.toContain('<script>');
    });

    it('should preserve non-string properties', () => {
      const obj = {
        name: 'John',
        age: 30,
        active: true,
        tags: ['admin', 'user'],
      };
      const result = sanitiseObject(obj);
      expect(result.age).toBe(30);
      expect(result.active).toBe(true);
      expect(result.tags).toEqual(['admin', 'user']);
    });

    it('should handle null values', () => {
      const obj = {
        name: 'John',
        middleName: null,
      };
      const result = sanitiseObject(obj);
      expect(result.middleName).toBeNull();
    });

    it('should not mutate original object', () => {
      const obj = {
        name: '<b>John</b>',
      };
      const original = obj.name;
      sanitiseObject(obj);
      expect(obj.name).toBe(original);
    });
  });
});
