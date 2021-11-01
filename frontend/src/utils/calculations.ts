export const byteToGb = (byte: number, commas = 1): number => {
  return (
    Math.round((byte / 1024 / 1024 / 1024) * Math.pow(10, commas)) /
    Math.pow(10, commas)
  );
};

export const byteToMb = (byte: number, commas = 1): number => {
  return (
    Math.round((byte / 1024 / 1024) * Math.pow(10, commas)) /
    Math.pow(10, commas)
  );
};
