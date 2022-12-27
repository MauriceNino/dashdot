export const clamp = (num: number, min: number, max: number) => {
  return num > max ? max : num < min ? min : num;
};

export const removePad = (strings: TemplateStringsArray, ...content: any[]) => {
  const complete = strings.reduce(
    (acc, s, i) => `${acc}${s}${content[i] ?? ''}`,
    ''
  );
  const trimmed = complete.split('\n').filter(s => /^\s*$/.test(s) === false);
  const shortestPad = Math.min(...trimmed.map(s => /(?!\s)/.exec(s)!.index));

  return trimmed.map(s => s.substring(shortestPad)).join('\n');
};
