export const byteToGb = (byte: number, commas = 1): number => {
  return toCommas(byte / 1024 / 1024 / 1024, commas);
};

export const byteToMb = (byte: number, commas = 1): number => {
  return toCommas(byte / 1024 / 1024, commas);
};

export const toCommas = (num: number, commas = 1): number => {
  return Math.round(num * Math.pow(10, commas)) / Math.pow(10, commas);
};

export const bpsPrettyPrint = (bits: number) => {
  if (bits > 1000 * 1000 * 1000) {
    return `${(bits / 1000 / 1000 / 1000).toFixed(1)} Gb/s`;
  } else if (bits > 1000 * 1000) {
    return `${(bits / 1000 / 1000).toFixed(1)} Mb/s`;
  } else if (bits > 1000) {
    return `${(bits / 1000).toFixed(1)} Kb/s`;
  } else {
    return `${bits.toFixed(1)} b/s`;
  }
};

export const bytePrettyPrint = (byte: number): string => {
  return byte > 1024 * 1024 * 1024
    ? `${(byte / 1024 / 1024 / 1024).toFixed(1)} GB`
    : byte > 1024 * 1024
    ? `${(byte / 1024 / 1024).toFixed(1)} MB`
    : byte > 1024
    ? `${(byte / 1024).toFixed(1)} KB`
    : `${byte.toFixed(1)} B`;
};
