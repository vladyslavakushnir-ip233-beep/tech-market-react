/**
 * Test 3: Cart Operations
 * Unit tests for shopping cart logic
 */

import { test } from 'node:test';
import assert from 'node:assert';

const mockCartOperations = {
  addToCart: (cart, item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    return cart;
  },
  removeFromCart: (cart, itemId) => {
    return cart.filter(c => c.id !== itemId);
  },
  updateQuantity: (cart, itemId, quantity) => {
    const item = cart.find(c => c.id === itemId);
    if (item) item.quantity = Math.max(0, quantity);
    return cart;
  },
  calculateTotal: (cart) => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  clearCart: (cart) => []
};

test('Cart - Add item to empty cart', () => {
  let cart = [];
  cart = mockCartOperations.addToCart(cart, { id: 1, name: 'Item1', price: 100, quantity: 1 });
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].quantity, 1);
});

test('Cart - Add duplicate item should increase quantity', () => {
  let cart = [{ id: 1, name: 'Item1', price: 100, quantity: 1 }];
  cart = mockCartOperations.addToCart(cart, { id: 1, name: 'Item1', price: 100, quantity: 2 });
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].quantity, 3);
});

test('Cart - Remove item from cart', () => {
  let cart = [
    { id: 1, name: 'Item1', price: 100, quantity: 1 },
    { id: 2, name: 'Item2', price: 50, quantity: 2 }
  ];
  cart = mockCartOperations.removeFromCart(cart, 1);
  assert.strictEqual(cart.length, 1);
  assert.strictEqual(cart[0].id, 2);
});

test('Cart - Update item quantity', () => {
  let cart = [{ id: 1, name: 'Item1', price: 100, quantity: 1 }];
  cart = mockCartOperations.updateQuantity(cart, 1, 5);
  assert.strictEqual(cart[0].quantity, 5);
});

test('Cart - Calculate cart total correctly', () => {
  const cart = [
    { id: 1, name: 'Item1', price: 100, quantity: 2 },
    { id: 2, name: 'Item2', price: 50, quantity: 3 }
  ];
  const total = mockCartOperations.calculateTotal(cart);
  assert.strictEqual(total, 100 * 2 + 50 * 3);
  assert.strictEqual(total, 350);
});

test('Cart - Clear cart should return empty array', () => {
  const cart = [{ id: 1, name: 'Item1', price: 100, quantity: 2 }];
  const cleared = mockCartOperations.clearCart(cart);
  assert.strictEqual(cleared.length, 0);
  assert.ok(Array.isArray(cleared));
});

test('Cart - Apply discount to cart total', () => {
  const cart = [
    { id: 1, name: 'Item1', price: 100, quantity: 1, discount: 10 },
    { id: 2, name: 'Item2', price: 50, quantity: 1, discount: 0 }
  ];
  const calculateWithDiscount = (cart) => {
    return cart.reduce((sum, item) => {
      const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
      return sum + (discountedPrice * item.quantity);
    }, 0);
  };
  const total = calculateWithDiscount(cart);
  assert.strictEqual(total, 90 + 50);
  assert.strictEqual(total, 140);
});
