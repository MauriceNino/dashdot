import { Config, RamInfo, RamLoad } from '@dash/common';
import { faMemory } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';
import { Tooltip, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { DefaultAreaChart } from '../components/chart-components';
import {
  ChartContainer,
  MultiChartContainer,
} from '../components/chart-container';
import { HardwareInfoContainer } from '../components/hardware-info-container';
import { ThemedText } from '../components/text';
import { useIsMobile } from '../services/mobile';
import { removeDuplicates } from '../utils/array-utils';
import { bytePrettyPrint } from '../utils/calculations';
import { toInfoTable } from '../utils/format';
import { ChartVal } from '../utils/types';

export type RamChartProps = {
  load: RamLoad[];
  data: RamInfo;
  showPercentages: boolean;
  textOffset?: string;
  textSize?: string;
};

export const RamChart: FC<RamChartProps> = ({
  load,
  data,
  showPercentages,
  textOffset,
  textSize,
}) => {
  const theme = useTheme();

  const chartData = load.map((load, i) => ({
    x: i,
    y: (load / (data.size ?? 1)) * 100,
  })) as ChartVal[];

  return (
    <MultiChartContainer>
      <ChartContainer
        contentLoaded={chartData.length > 1}
        textLeft={
          showPercentages
            ? `%: ${(chartData[chartData.length - 1]?.y as number)?.toFixed(
                1
              )} (${bytePrettyPrint(load[load.length - 1] ?? 0)})`
            : undefined
        }
        textOffset={textOffset}
        textSize={textSize}
        renderChart={size => (
          <DefaultAreaChart
            data={chartData}
            height={size.height}
            width={size.width}
            color={theme.colors.ramPrimary}
            renderTooltip={val => `${val.payload?.[0]?.value?.toFixed(1)} %`}
          >
            <YAxis hide={true} type='number' domain={[-5, 105]} />
            <Tooltip
              content={x => (
                <ThemedText>
                  {(x.payload?.[0]?.value as number)?.toFixed(1)} %
                </ThemedText>
              )}
            />
          </DefaultAreaChart>
        )}
      ></ChartContainer>
    </MultiChartContainer>
  );
};

type RamWidgetProps = {
  load: RamLoad[];
  data: RamInfo;
  config: Config;
};

export const RamWidget: FC<RamWidgetProps> = ({ load, data, config }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
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
      <RamChart
        showPercentages={config.always_show_percentages || isMobile}
        load={load}
        data={data}
      />
    </HardwareInfoContainer>
  );
};
