/**
 * Test 4: Order Processing
 * Unit tests for order operations
 */

import { test } from 'node:test';
import assert from 'node:assert';

const orderOperations = {
  createOrder: (customerId, items, total) => {
    if (!customerId || !items.length || total <= 0) return null;
    return {
      id: Math.random().toString(36).substr(2, 9),
      customer_id: customerId,
      items: items,
      total: total,
      status: 'pending',
      created_at: new Date().toISOString()
    };
  },
  updateOrderStatus: (order, newStatus) => {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (validStatuses.includes(newStatus)) {
      order.status = newStatus;
      return order;
    }
    return null;
  },
  calculateOrderTotal: (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  validateOrderItems: (items) => {
    return items.every(item => item.id && item.price > 0 && item.quantity > 0);
  }
};

test('Order - Create valid order', () => {
  const items = [
    { id: 1, price: 100, quantity: 2 },
    { id: 2, price: 50, quantity: 1 }
  ];
  const order = orderOperations.createOrder(1, items, 250);
  assert.ok(order);
  assert.strictEqual(order.customer_id, 1);
  assert.strictEqual(order.status, 'pending');
});

test('Order - Reject order with invalid data', () => {
  const order = orderOperations.createOrder(0, [], -50);
  assert.strictEqual(order, null);
});

test('Order - Update order status', () => {
  const order = { id: 1, status: 'pending' };
  const updated = orderOperations.updateOrderStatus(order, 'confirmed');
  assert.strictEqual(updated.status, 'confirmed');
});

test('Order - Reject invalid order status', () => {
  const order = { id: 1, status: 'pending' };
  const result = orderOperations.updateOrderStatus(order, 'invalid_status');
  assert.strictEqual(result, null);
});

test('Order - Calculate order total from items', () => {
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 3 }
  ];
  const total = orderOperations.calculateOrderTotal(items);
  assert.strictEqual(total, 100 * 2 + 50 * 3);
  assert.strictEqual(total, 350);
});

test('Order - Validate order items', () => {
  const validItems = [
    { id: 1, price: 100, quantity: 2 },
    { id: 2, price: 50, quantity: 1 }
  ];
  const invalidItems = [
    { id: 1, price: -100, quantity: 2 }
  ];
  assert.strictEqual(orderOperations.validateOrderItems(validItems), true);
  assert.strictEqual(orderOperations.validateOrderItems(invalidItems), false);
});

test('Order - Order timestamp should be valid ISO format', () => {
  const items = [{ id: 1, price: 100, quantity: 1 }];
  const order = orderOperations.createOrder(1, items, 100);
  assert.ok(order.created_at);
  assert.strictEqual(new Date(order.created_at).toISOString(), order.created_at);
});
