export type InfoTableArr = {
  label: string;
  value?: string;
  tooltip?: string;
}[];

export const toInfoTable = <T extends Array<string>>(
  order: T,
  mappings: Record<
    T[number],
    { label: string; value?: string | number; tooltip?: string }
  >
): InfoTableArr =>
  order.map(key => {
    const { label, tooltip, value } = mappings[key as T[number]];

    return {
      label,
      tooltip,
      value: value
        ? typeof value === 'number'
          ? value.toString()
          : value
        : undefined,
    };
  });
