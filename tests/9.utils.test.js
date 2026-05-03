/**
 * Test 9: Data Formatting & Utilities
 * Unit tests for utility functions
 */

import { test } from 'node:test';
import assert from 'node:assert';

const utils = {
  formatDate: (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
  },
  formatCurrency: (amount) => {
    return `${amount.toFixed(2)} грн`;
  },
  formatTime: (date) => {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  },
  truncateText: (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  },
  capitalizeFirst: (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  pluralize: (count, singular, plural) => {
    return count === 1 ? singular : plural;
  },
  generateId: () => Math.random().toString(36).substr(2, 9),
  slugify: (text) => text.toLowerCase().replace(/\s+/g, '-')
};

test('Utils - Format date correctly', () => {
  const date = new Date('2024-01-15T10:30:00Z');
  const formatted = utils.formatDate(date);
  assert.match(formatted, /15/);
  assert.match(formatted, /01/);
  assert.match(formatted, /2024/);
});

test('Utils - Format currency correctly', () => {
  assert.strictEqual(utils.formatCurrency(99.5), '99.50 грн');
  assert.strictEqual(utils.formatCurrency(1000), '1000.00 грн');
});

test('Utils - Format time correctly', () => {
  const date = new Date('2024-01-15T09:05:00Z');
  const formatted = utils.formatTime(date);
  assert.match(formatted, /\d{2}:\d{2}/);
});

test('Utils - Truncate text with ellipsis', () => {
  const text = 'This is a long text that should be truncated';
  const truncated = utils.truncateText(text, 10);
  assert.strictEqual(truncated, 'This is a ...');
  assert.ok(truncated.length < text.length);
});

test('Utils - Truncate text when shorter than limit', () => {
  const text = 'Short';
  const truncated = utils.truncateText(text, 20);
  assert.strictEqual(truncated, 'Short');
});

test('Utils - Capitalize first letter', () => {
  assert.strictEqual(utils.capitalizeFirst('hello'), 'Hello');
  assert.strictEqual(utils.capitalizeFirst('WORLD'), 'WORLD');
});

test('Utils - Pluralize correctly', () => {
  assert.strictEqual(utils.pluralize(1, 'item', 'items'), 'item');
  assert.strictEqual(utils.pluralize(2, 'item', 'items'), 'items');
  assert.strictEqual(utils.pluralize(0, 'item', 'items'), 'items');
});

test('Utils - Generate unique ID', () => {
  const id1 = utils.generateId();
  const id2 = utils.generateId();
  assert.ok(id1);
  assert.ok(id2);
  assert.notStrictEqual(id1, id2);
});

test('Utils - Slugify text', () => {
  assert.strictEqual(utils.slugify('Hello World'), 'hello-world');
  assert.strictEqual(utils.slugify('My Product Name'), 'my-product-name');
});
