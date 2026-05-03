/**
 * Test 8: User Role & Permissions
 * Unit tests for authorization logic
 */

import { test } from 'node:test';
import assert from 'node:assert';

const permissions = {
  canViewProduct: (user) => true,
  canEditProduct: (user) => user && user.role === 'admin',
  canDeleteProduct: (user) => user && user.role === 'admin',
  canApproveReview: (user) => user && user.role === 'admin',
  canViewOrders: (user) => user && (user.role === 'admin' || user.role === 'user'),
  canViewOwnOrders: (user, orderUserId) => {
    return user && (user.role === 'admin' || user.id === orderUserId);
  },
  canManageSuppliers: (user) => user && user.role === 'admin',
  isAdmin: (user) => user && user.role === 'admin'
};

const adminUser = { id: 1, email: 'admin@test.com', role: 'admin' };
const regularUser = { id: 2, email: 'user@test.com', role: 'user' };
const guestUser = null;

test('Permissions - Anyone can view products', () => {
  assert.strictEqual(permissions.canViewProduct(adminUser), true);
  assert.strictEqual(permissions.canViewProduct(regularUser), true);
  assert.strictEqual(permissions.canViewProduct(guestUser), true);
});

test('Permissions - Only admin can edit products', () => {
  assert.strictEqual(permissions.canEditProduct(adminUser), true);
  assert.ok(!permissions.canEditProduct(regularUser));
  assert.ok(!permissions.canEditProduct(guestUser));
});

test('Permissions - Only admin can delete products', () => {
  assert.strictEqual(permissions.canDeleteProduct(adminUser), true);
  assert.strictEqual(permissions.canDeleteProduct(regularUser), false);
});

test('Permissions - Only admin can approve reviews', () => {
  assert.strictEqual(permissions.canApproveReview(adminUser), true);
  assert.strictEqual(permissions.canApproveReview(regularUser), false);
});

test('Permissions - Users and admin can view orders', () => {
  assert.strictEqual(permissions.canViewOrders(adminUser), true);
  assert.strictEqual(permissions.canViewOrders(regularUser), true);
  assert.ok(!permissions.canViewOrders(guestUser));
});

test('Permissions - Users can only view their own orders', () => {
  assert.strictEqual(permissions.canViewOwnOrders(regularUser, 2), true);
  assert.strictEqual(permissions.canViewOwnOrders(regularUser, 3), false);
  assert.strictEqual(permissions.canViewOwnOrders(adminUser, 999), true); // Admin can view any
});

test('Permissions - Only admin can manage suppliers', () => {
  assert.strictEqual(permissions.canManageSuppliers(adminUser), true);
  assert.strictEqual(permissions.canManageSuppliers(regularUser), false);
});

test('Permissions - Admin identification', () => {
  assert.strictEqual(permissions.isAdmin(adminUser), true);
  assert.ok(!permissions.isAdmin(regularUser));
  assert.ok(!permissions.isAdmin(guestUser));
});
