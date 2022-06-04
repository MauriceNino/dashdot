export type InfoTableArr = {
  label: string;
  value?: string;
}[];

export const toInfoTable = <T extends string>(
  order: T[],
  labels: { [key in T]: string },
  data: { key: T; value?: string }[]
): InfoTableArr =>
  order.map(key => {
    const label = labels[key];
    const val = data.find(d => d.key === key);

    return {
      label,
      value: val?.value ? val.value : undefined,
    };
  });
