import test from 'node:test';
import assert from 'node:assert';
import sum from './index.js';

test('sum should return correct addition for positive numbers', () => {
  assert.strictEqual(sum(2, 3), 5);
  assert.strictEqual(sum(0, 0), 0);
  assert.strictEqual(sum(10, 20), 30);
});

test('sum should return 0 if any argument is not a number', () => {
  assert.strictEqual(sum('2', 3), 0);
  assert.strictEqual(sum(2, '3'), 0);
  assert.strictEqual(sum(null, 5), 0);
  assert.strictEqual(sum(undefined, undefined), 0);
  assert.strictEqual(sum({}, []), 0);
});

test('sum should return 0 if any argument is a negative number', () => {
  assert.strictEqual(sum(-1, 5), 0);
  assert.strictEqual(sum(5, -1), 0);
  assert.strictEqual(sum(-5, -5), 0);
});