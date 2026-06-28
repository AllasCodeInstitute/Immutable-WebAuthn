import { expect } from 'bun:test';
import assert from 'node:assert/strict';
export const assertEquals = assert.deepEqual;
export const assertNotEquals = assert.notStrictEqual;
export const assertStrictEquals = assert.strictEqual;
export const assertFalse = (actual: unknown, msg?: string) => assert.equal(actual, false, msg);
export const assertInstanceOf = (actual: unknown, expectedType: new (...args: any[]) => any, msg?: string) => assert.ok(actual instanceof expectedType, msg);
export const assertStringIncludes = (actual: string, expected: string, msg?: string) => assert.ok(actual.includes(expected), msg);
export const assertObjectMatch = (actual: object, expected: object) => expect(actual).toMatchObject(expected);
export const assertRejects = async (fn: () => unknown | Promise<unknown>, errorClassOrMsg?: any, msgIncludes?: string) => {
  try { await fn(); } catch (err) {
    if (typeof errorClassOrMsg === 'function') assert.ok(err instanceof errorClassOrMsg);
    if (msgIncludes) assert.ok(String((err as Error).message).includes(msgIncludes));
    return err;
  }
  throw new assert.AssertionError({ message: 'Expected function to reject' });
};
export { assert };
