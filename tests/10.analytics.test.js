/**
 * Test 10: Analytics & Statistics
 * Unit tests for analytics calculations
 */

import { test } from 'node:test';
import assert from 'node:assert';

const analytics = {
  calculateTotalRevenue: (orders) => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  },
  calculateAverageOrderValue: (orders) => {
    if (!orders.length) return 0;
    return analytics.calculateTotalRevenue(orders) / orders.length;
  },
  countOrdersByStatus: (orders) => {
    const counts = {};
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  },
  getTopProducts: (orderItems, limit = 5) => {
    const productCount = {};
    orderItems.forEach(item => {
      productCount[item.product_id] = (productCount[item.product_id] || 0) + item.qty;
    });
    return Object.entries(productCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, qty]) => ({ id: parseInt(id), qty }));
  },
  calculateInventoryValue: (products) => {
    return products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  },
  getProductsByCategory: (products) => {
    const byCategory = {};
    products.forEach(p => {
      if (!byCategory[p.category]) byCategory[p.category] = [];
      byCategory[p.category].push(p);
    });
    return byCategory;
  },
  calculateCategoryRevenue: (orders, orderItems, products) => {
    const revenue = {};
    orderItems.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        revenue[product.category] = (revenue[product.category] || 0) + (item.price * item.qty);
      }
    });
    return revenue;
  }
};

const mockOrders = [
  { id: 1, total: 1000, status: 'delivered' },
  { id: 2, total: 500, status: 'shipped' },
  { id: 3, total: 750, status: 'pending' },
  { id: 4, total: 1200, status: 'delivered' }
];

test('Analytics - Calculate total revenue', () => {
  const total = analytics.calculateTotalRevenue(mockOrders);
  assert.strictEqual(total, 1000 + 500 + 750 + 1200);
  assert.strictEqual(total, 3450);
});

test('Analytics - Calculate average order value', () => {
  const avg = analytics.calculateAverageOrderValue(mockOrders);
  assert.strictEqual(avg, 3450 / 4);
  assert.strictEqual(avg, 862.5);
});

test('Analytics - Count orders by status', () => {
  const counts = analytics.countOrdersByStatus(mockOrders);
  assert.strictEqual(counts.delivered, 2);
  assert.strictEqual(counts.shipped, 1);
  assert.strictEqual(counts.pending, 1);
});

test('Analytics - Handle empty orders for average', () => {
  const avg = analytics.calculateAverageOrderValue([]);
  assert.strictEqual(avg, 0);
});

test('Analytics - Get top products by quantity', () => {
  const orderItems = [
    { product_id: 1, qty: 5 },
    { product_id: 2, qty: 3 },
    { product_id: 1, qty: 2 },
    { product_id: 3, qty: 4 }
  ];
  const top = analytics.getTopProducts(orderItems, 2);
  assert.strictEqual(top[0].id, 1);
  assert.strictEqual(top[0].qty, 7);
  assert.strictEqual(top[1].id, 3);
});

test('Analytics - Calculate inventory value', () => {
  const products = [
    { price: 100, stock: 5 },
    { price: 50, stock: 10 },
    { price: 25, stock: 4 }
  ];
  const value = analytics.calculateInventoryValue(products);
  assert.strictEqual(value, 100 * 5 + 50 * 10 + 25 * 4);
  assert.strictEqual(value, 1100);
});

test('Analytics - Group products by category', () => {
  const products = [
    { id: 1, name: 'Laptop', category: 'Electronics' },
    { id: 2, name: 'Mouse', category: 'Accessories' },
    { id: 3, name: 'Monitor', category: 'Electronics' }
  ];
  const grouped = analytics.getProductsByCategory(products);
  assert.strictEqual(grouped.Electronics.length, 2);
  assert.strictEqual(grouped.Accessories.length, 1);
});

test('Analytics - Calculate revenue by category', () => {
  const products = [
    { id: 1, category: 'Electronics' },
    { id: 2, category: 'Accessories' }
  ];
  const orderItems = [
    { product_id: 1, price: 1000, qty: 2 },
    { product_id: 2, price: 50, qty: 5 }
  ];
  const revenue = analytics.calculateCategoryRevenue([], orderItems, products);
  assert.strictEqual(revenue.Electronics, 2000);
  assert.strictEqual(revenue.Accessories, 250);
});
