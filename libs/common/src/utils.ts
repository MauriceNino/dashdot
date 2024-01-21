export const clamp = (num: number, min: number, max: number) => {
  return num > max ? max : num < min ? min : num;
};

export const sumUp = <T extends any[]>(arr: T, key: keyof T[number]) => {
  return arr.reduce((acc, obj) => acc + obj[key], 0);
};

export const findLastIndex = <T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number => {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
};

export const isFilledLine = (s: string): boolean => /^\s*$/.test(s) === false;

export const capFirst = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};
