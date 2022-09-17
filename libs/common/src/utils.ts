export const clamp = (num: number, min: number, max: number) => {
  return num > max ? max : num < min ? min : num;
};
