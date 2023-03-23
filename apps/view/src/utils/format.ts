export type InfoTableArr = {
  label: string;
  value?: string;
}[];

export const toInfoTable = <T extends Array<string>>(
  order: T,
  mappings: Record<T[number], { label: string; value?: string | number }>
): InfoTableArr =>
  order.map(key => {
    const { label, value } = mappings[key as T[number]];

    return {
      label,
      value: value
        ? typeof value === 'number'
          ? value.toString()
          : value
        : undefined,
    };
  });
