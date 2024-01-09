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

export const removePad = (strings: TemplateStringsArray, ...content: any[]) => {
  const complete = strings.reduce(
    (acc, s, i) => `${acc}${s}${content[i] ?? ''}`,
    ''
  );

  const lines = complete.split('\n');
  const trimmed = lines.slice(
    lines.findIndex(isFilledLine),
    findLastIndex(lines, isFilledLine) + 1
  );

  const shortestPad = Math.min(
    ...trimmed.filter(isFilledLine).map(s => /(?!\s)/.exec(s)!.index)
  );

  return trimmed.map(s => s.substring(shortestPad)).join('\n');
};

export const capFirst = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};
