import { mock } from 'bun:test';
export type Spy<T = any> = any;
export type Stub<T = any> = any;
export const spy = (obj?: any, method?: string) => method ? mock(obj[method].bind(obj)) : mock(obj ?? (() => {}));
export const stub = (obj: any, method: string, replacement?: any) => {
  const original = obj[method];
  const fn = mock(replacement ?? (() => undefined)) as any;
  fn.calls = fn.mock.calls.map((args: unknown[]) => ({ args }));
  const wrapped = ((...args: unknown[]) => {
    const result = fn(...args);
    wrapped.calls = fn.mock.calls.map((callArgs: unknown[]) => ({ args: callArgs }));
    return result;
  }) as any;
  wrapped.mock = fn.mock;
  wrapped.calls = [];
  obj[method] = wrapped;
  wrapped.restore = () => { obj[method] = original; };
  return wrapped;
};
export const assertSpyCalls = (fn: any, count: number) => {
  if ((fn.mock?.calls?.length ?? 0) !== count) throw new Error(`Expected ${count} calls, got ${fn.mock?.calls?.length ?? 0}`);
};
export const assertSpyCallArg = (fn: any, call: number, arg: number, expected: unknown) => {
  const actual = fn.mock?.calls?.[call]?.[arg];
  if (!Object.is(actual, expected)) throw new Error(`Expected call ${call} arg ${arg} to be ${expected}, got ${actual}`);
};
export const returnsNext = (values: unknown[]) => () => values.shift();
export const resolvesNext = (values: unknown[]) => () => Promise.resolve(values.shift());
