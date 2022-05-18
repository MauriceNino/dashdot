export const byteToGb = (byte: number, commas = 1): number => {
  return toCommas(byte / 1024 / 1024 / 1024, commas);
};

export const byteToMb = (byte: number, commas = 1): number => {
  return toCommas(byte / 1024 / 1024, commas);
};

export const toCommas = (num: number, commas = 1): number => {
  return Math.round(num * Math.pow(10, commas)) / Math.pow(10, commas);
};

export const toFixedCommas = (num: number, commas = 1): string => {
  return num.toFixed(commas);
};
