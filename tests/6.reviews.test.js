/**
 * Test 6: Reviews & Comments
 * Unit tests for review system
 */

import { test } from 'node:test';
import assert from 'node:assert';

const reviewOperations = {
  createReview: (productId, userId, username, rating, comment) => {
    if (!productId || !userId || !rating || rating < 1 || rating > 5) return null;
    return {
      id: Math.random().toString(36).substr(2, 9),
      product_id: productId,
      user_id: userId,
      username: username || 'Anonymous',
      rating: rating,
      comment: comment || '',
      approved: false,
      created_at: new Date().toISOString()
    };
  },
  approveReview: (review) => {
    review.approved = true;
    return review;
  },
  rejectReview: (review) => {
    review.approved = false;
    return review;
  },
  calculateAverageRating: (reviews) => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  },
  validateComment: (comment) => {
    return comment.length > 0 && comment.length <= 500;
  }
};

test('Review - Create valid review', () => {
  const review = reviewOperations.createReview(1, 1, 'John', 5, 'Great product!');
  assert.ok(review);
  assert.strictEqual(review.rating, 5);
  assert.strictEqual(review.approved, false);
});

test('Review - Reject review with invalid rating', () => {
  assert.strictEqual(reviewOperations.createReview(1, 1, 'John', 0, 'Bad'), null);
  assert.strictEqual(reviewOperations.createReview(1, 1, 'John', 6, 'Too high'), null);
});

test('Review - Approve review', () => {
  let review = { id: 1, approved: false };
  review = reviewOperations.approveReview(review);
  assert.strictEqual(review.approved, true);
});

test('Review - Calculate average rating', () => {
  const reviews = [
    { rating: 5 },
    { rating: 4 },
    { rating: 3 }
  ];
  const avg = reviewOperations.calculateAverageRating(reviews);
  assert.strictEqual(avg, '4.0');
});

test('Review - Calculate average rating with single review', () => {
  const reviews = [{ rating: 5 }];
  const avg = reviewOperations.calculateAverageRating(reviews);
  assert.strictEqual(avg, '5.0');
});

test('Review - Handle empty reviews for average', () => {
  const avg = reviewOperations.calculateAverageRating([]);
  assert.strictEqual(avg, 0);
});

test('Review - Validate comment length', () => {
  assert.strictEqual(reviewOperations.validateComment('Good!'), true);
  assert.strictEqual(reviewOperations.validateComment('a'.repeat(500)), true);
  assert.strictEqual(reviewOperations.validateComment('a'.repeat(501)), false);
  assert.strictEqual(reviewOperations.validateComment(''), false);
});

test('Review - Review includes required metadata', () => {
  const review = reviewOperations.createReview(1, 1, 'John', 5, 'Great!');
  assert.ok(review.id);
  assert.ok(review.created_at);
  assert.strictEqual(new Date(review.created_at).toISOString(), review.created_at);
});
