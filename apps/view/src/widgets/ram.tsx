import { Config, RamInfo, RamLoad } from '@dash/common';
import { faMemory } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { Datum } from '@nivo/line';
import { FC } from 'react';
import { Tooltip, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { DefaultAreaChart } from '../components/chart-components';
import { ChartContainer } from '../components/chart-container';
import { HardwareInfoContainer } from '../components/hardware-info-container';
import { ThemedText } from '../components/text';
import { removeDuplicates } from '../utils/array-utils';
import { bytePrettyPrint } from '../utils/calculations';
import { toInfoTable } from '../utils/format';

type RamWidgetProps = {
  load: RamLoad[];
  data: RamInfo;
  config: Config;
};

export const RamWidget: FC<RamWidgetProps> = ({ load, data, config }) => {
  const theme = useTheme();
  const override = config.override;

  const brands = removeDuplicates(
    override.ram_brand ? [override.ram_brand] : data.layout?.map(l => l.brand)
  );
  const size = override.ram_size ?? data.size;
  const types = removeDuplicates(
    override.ram_type ? [override.ram_type] : data.layout?.map(l => l.type)
  );
  const frequencies = removeDuplicates(
    override.ram_frequency
      ? [override.ram_frequency]
      : data.layout?.map(l => l.frequency).filter(c => c && c !== 0)
  ).map(s => `${s} MHz`);

  const chartData = load.map((load, i) => ({
    x: i,
    y: (load / (data.size ?? 1)) * 100,
  })) as Datum[];

  return (
    <HardwareInfoContainer
      color={theme.colors.ramPrimary}
      heading='Memory'
      infos={toInfoTable(
        config.ram_label_list,
        {
          brand: brands.length > 1 ? 'Brands' : 'Brand',
          size: 'Size',
          type: types.length > 1 ? 'Types' : 'Type',
          frequency: frequencies.length > 1 ? 'Frequencies' : 'Frequency',
        },
        [
          {
            key: 'brand',
            value: brands.join(', '),
          },
          {
            key: 'size',
            value: size ? `${bytePrettyPrint(size)}` : '',
          },
          {
            key: 'type',
            value: types.join(', '),
          },
          {
            key: 'frequency',
            value: frequencies.join(', '),
          },
        ]
      )}
      infosPerPage={7}
      icon={faMemory}
    >
      <ChartContainer
        contentLoaded={chartData.length > 1}
        statText={`%: ${(chartData[chartData.length - 1]?.y as number)?.toFixed(
          1
        )} (${bytePrettyPrint(load[load.length - 1] ?? 0)})`}
      >
        {size => (
          <DefaultAreaChart
            data={chartData}
            height={size.height}
            width={size.width}
            color={theme.colors.ramPrimary}
          >
            <YAxis hide={true} type='number' domain={[-5, 105]} />
            <Tooltip
              content={x => (
                <ThemedText>
                  {(x.payload?.[0]?.value as number)?.toFixed(2)} %
                </ThemedText>
              )}
            />
          </DefaultAreaChart>
        )}
      </ChartContainer>
    </HardwareInfoContainer>
  );
};
