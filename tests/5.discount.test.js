/**
 * Test 5: Discount & Pricing
 * Unit tests for discount logic
 */

import { test } from 'node:test';
import assert from 'node:assert';

const discountOperations = {
  applyDiscount: (price, discountPercent) => {
    if (discountPercent < 0 || discountPercent > 100) return null;
    return price * (1 - discountPercent / 100);
  },
  calculateDiscountAmount: (price, discountPercent) => {
    return price * (discountPercent / 100);
  },
  validateDiscount: (discount) => {
    return discount >= 0 && discount <= 100;
  },
  applyBulkDiscount: (quantity, basePrice) => {
    if (quantity >= 10) return basePrice * 0.9; // 10% off
    if (quantity >= 5) return basePrice * 0.95; // 5% off
    return basePrice;
  },
  formatPrice: (price) => {
    return `${price.toFixed(2)} грн`;
  }
};

test('Discount - Apply 10% discount to product', () => {
  const discounted = discountOperations.applyDiscount(100, 10);
  assert.strictEqual(discounted, 90);
});

test('Discount - Apply 50% discount to product', () => {
  const discounted = discountOperations.applyDiscount(200, 50);
  assert.strictEqual(discounted, 100);
});

test('Discount - Reject invalid discount percentage', () => {
  assert.strictEqual(discountOperations.applyDiscount(100, -10), null);
  assert.strictEqual(discountOperations.applyDiscount(100, 150), null);
});

test('Discount - Calculate discount amount', () => {
  const amount = discountOperations.calculateDiscountAmount(1000, 20);
  assert.strictEqual(amount, 200);
});

test('Discount - Validate discount values', () => {
  assert.strictEqual(discountOperations.validateDiscount(0), true);
  assert.strictEqual(discountOperations.validateDiscount(50), true);
  assert.strictEqual(discountOperations.validateDiscount(100), true);
  assert.strictEqual(discountOperations.validateDiscount(-5), false);
  assert.strictEqual(discountOperations.validateDiscount(105), false);
});

test('Discount - Apply bulk quantity discount', () => {
  assert.strictEqual(discountOperations.applyBulkDiscount(3, 100), 100);
  assert.strictEqual(discountOperations.applyBulkDiscount(5, 100), 95);
  assert.strictEqual(discountOperations.applyBulkDiscount(10, 100), 90);
});

test('Discount - Format price correctly', () => {
  assert.strictEqual(discountOperations.formatPrice(99.99), '99.99 грн');
  assert.strictEqual(discountOperations.formatPrice(1000), '1000.00 грн');
});

test('Discount - Chain discount calculation', () => {
  let price = 1000;
  price = discountOperations.applyDiscount(price, 10); // 900
  price = discountOperations.applyDiscount(price, 5); // 855
  assert.ok(Math.abs(price - 855) < 0.1);
});
