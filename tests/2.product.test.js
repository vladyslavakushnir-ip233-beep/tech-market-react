/**
 * Test 2: Product Management
 * Unit tests for product operations
 */

import { test } from 'node:test';
import assert from 'node:assert';

const mockProducts = [
  { id: 1, name: 'Laptop', price: 1000, stock: 5, category: 'Electronics', discount: 0 },
  { id: 2, name: 'Mouse', price: 25, stock: 50, category: 'Accessories', discount: 10 },
  { id: 3, name: 'Keyboard', price: 75, stock: 0, category: 'Accessories', discount: 0 }
];

test('Product - Get all products should return list', () => {
  assert.strictEqual(mockProducts.length, 3);
  assert.strictEqual(mockProducts[0].name, 'Laptop');
});

test('Product - Filter products by category', () => {
  const filtered = mockProducts.filter(p => p.category === 'Accessories');
  assert.strictEqual(filtered.length, 2);
  assert.ok(filtered.every(p => p.category === 'Accessories'));
});

test('Product - Calculate product price with discount', () => {
  const calculatePrice = (price, discount) => price * (1 - discount / 100);
  const mousePrice = calculatePrice(mockProducts[1].price, mockProducts[1].discount);
  assert.strictEqual(mousePrice, 22.5);
});

test('Product - Check stock availability', () => {
  const isInStock = (product) => product.stock > 0;
  assert.strictEqual(isInStock(mockProducts[0]), true);
  assert.strictEqual(isInStock(mockProducts[2]), false);
});

test('Product - Validate product data on create', () => {
  const validateProduct = (product) => {
    return product.name && product.price > 0 && product.category && product.stock >= 0;
  };
  const validProduct = { name: 'Monitor', price: 300, category: 'Electronics', stock: 10 };
  const invalidProduct = { name: 'Monitor', price: -50, category: 'Electronics' };
  assert.strictEqual(validateProduct(validProduct), true);
  assert.strictEqual(validateProduct(invalidProduct), false);
});

test('Product - Calculate total stock value', () => {
  const totalValue = mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
  assert.strictEqual(totalValue, 1000 * 5 + 25 * 50 + 75 * 0);
  assert.strictEqual(totalValue, 6250);
});

test('Product - Find product by ID', () => {
  const findById = (id) => mockProducts.find(p => p.id === id);
  const product = findById(2);
  assert.ok(product);
  assert.strictEqual(product.name, 'Mouse');
});
