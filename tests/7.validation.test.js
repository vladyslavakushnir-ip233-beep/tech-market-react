/**
 * Test 7: Form Validation
 * Unit tests for form validation logic
 */

import { test } from 'node:test';
import assert from 'node:assert';

const validators = {
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  validatePassword: (password) => password.length >= 6,
  validateStrongPassword: (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  },
  validatePhone: (phone) => /^\d{10,}$/.test(phone.replace(/\D/g, '')),
  validateProductName: (name) => name.length > 0 && name.length <= 100,
  validatePrice: (price) => !isNaN(price) && price > 0,
  validateStockNumber: (stock) => Number.isInteger(stock) && stock >= 0
};

test('Validation - Valid email should pass', () => {
  assert.strictEqual(validators.validateEmail('user@example.com'), true);
  assert.strictEqual(validators.validateEmail('test.email@domain.co.uk'), true);
});

test('Validation - Invalid email should fail', () => {
  assert.strictEqual(validators.validateEmail('invalid-email'), false);
  assert.strictEqual(validators.validateEmail('user@'), false);
  assert.strictEqual(validators.validateEmail('user.example.com'), false);
});

test('Validation - Password length validation', () => {
  assert.strictEqual(validators.validatePassword('abc123'), true);
  assert.strictEqual(validators.validatePassword('short'), false);
});

test('Validation - Strong password validation', () => {
  assert.strictEqual(validators.validateStrongPassword('StrongP@ss123'), true);
  assert.strictEqual(validators.validateStrongPassword('weak'), false);
});

test('Validation - Phone number validation', () => {
  assert.strictEqual(validators.validatePhone('0991234567'), true);
  assert.strictEqual(validators.validatePhone('+38 099 123 45 67'), true);
  assert.strictEqual(validators.validatePhone('123'), false);
});

test('Validation - Product name validation', () => {
  assert.strictEqual(validators.validateProductName('Laptop'), true);
  assert.strictEqual(validators.validateProductName('a'.repeat(100)), true);
  assert.strictEqual(validators.validateProductName('a'.repeat(101)), false);
  assert.strictEqual(validators.validateProductName(''), false);
});

test('Validation - Price validation', () => {
  assert.strictEqual(validators.validatePrice(99.99), true);
  assert.strictEqual(validators.validatePrice(1000), true);
  assert.strictEqual(validators.validatePrice(0), false);
  assert.strictEqual(validators.validatePrice(-50), false);
  assert.strictEqual(validators.validatePrice('invalid'), false);
});

test('Validation - Stock number validation', () => {
  assert.strictEqual(validators.validateStockNumber(0), true);
  assert.strictEqual(validators.validateStockNumber(100), true);
  assert.strictEqual(validators.validateStockNumber(-5), false);
  assert.strictEqual(validators.validateStockNumber(3.5), false);
});
