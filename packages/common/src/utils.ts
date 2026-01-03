import type { NumericKeys } from './types';

export const clamp = (num: number, min: number, max: number) => {
  return num > max ? max : num < min ? min : num;
};

// biome-ignore lint/suspicious/noExplicitAny: I don't have the time to think about typing this and it does not matter
export const sumUp = <T extends Record<string, any>>(
  arr: T[],
  key: NumericKeys<T>,
) => {
  return arr.reduce((acc, obj) => acc + (obj[key] ?? 0), 0);
};

export const findLastIndex = <T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number => {
  let l = array.length;
  while (l--) {
    // biome-ignore lint/style/noNonNullAssertion: manually looping - we are sure its defined
    if (predicate(array[l]!, l, array)) return l;
  }
  return -1;
};

export const isFilledLine = (s: string): boolean => /^\s*$/.test(s) === false;

export const capFirst = (str: string) => {
  return str[0]?.toUpperCase() + str.slice(1);
};
