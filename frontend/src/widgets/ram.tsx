import { faMemory } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { linearGradientDef } from '@nivo/core';
import { Datum, ResponsiveLine } from '@nivo/line';
import { Config, RamInfo, RamLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import { ChartContainer } from '../components/chart-container';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { removeDuplicates } from '../utils/array-utils';
import { bytePrettyPrint, toCommas } from '../utils/calculations';

type RamWidgetProps = {
  load: RamLoad[];
  data?: RamInfo;
  config?: Config;
};

export const RamWidget: FC<RamWidgetProps> = ({ load, data, config }) => {
  const theme = useTheme();
  const override = config?.override;

  const brands = removeDuplicates(
    override?.ram_brand
      ? [override?.ram_brand]
      : data?.layout?.map(l => l.brand)
  );
  const size = override?.ram_size ?? data?.size;
  const types = removeDuplicates(
    override?.ram_type ? [override?.ram_type] : data?.layout?.map(l => l.type)
  );
  const frequencies = removeDuplicates(
    override?.ram_frequency
      ? [override?.ram_frequency]
      : data?.layout?.map(l => l.frequency).filter(c => c && c !== 0)
  ).map(s => `${s} MHz`);

  const chartData = load.map((load, i) => ({
    x: i,
    y: (load / (data?.size ?? 1)) * 100,
  })) as Datum[];

  return (
    <HardwareInfoContainer
      color={theme.colors.ramPrimary}
      heading='Memory'
      infos={[
        {
          label: brands.length > 1 ? 'Brands' : 'Brand',
          value: brands.join(', '),
        },
        {
          label: 'Size',
          value: size ? `${bytePrettyPrint(size)}` : '',
        },
        {
          label: types.length > 1 ? 'Types' : 'Type',
          value: types.join(', '),
        },
        {
          label: frequencies.length > 1 ? 'Frequencies' : 'Frequency',
          value: frequencies.join(', '),
        },
      ]}
      icon={faMemory}
    >
      <ChartContainer
        contentLoaded={chartData.length > 1}
        statText={`%: ${(chartData[chartData.length - 1]?.y as number)?.toFixed(
          1
        )} (${bytePrettyPrint(load[load.length - 1] ?? 0)})`}
      >
        <ResponsiveLine
          isInteractive={true}
          enableSlices='x'
          sliceTooltip={props => {
            const point = props.slice.points[0];
            return (
              <ThemedText>{toCommas(point.data.y as number, 2)} %</ThemedText>
            );
          }}
          data={[
            {
              id: 'ram',
              data: chartData,
            },
          ]}
          curve='monotoneX'
          enablePoints={false}
          animate={false}
          enableGridX={false}
          enableGridY={false}
          yScale={{
            type: 'linear',
            min: -5,
            max: 105,
          }}
          enableArea={true}
          defs={[
            linearGradientDef('gradientA', [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0 },
            ]),
          ]}
          fill={[{ match: '*', id: 'gradientA' }]}
          colors={theme.colors.ramPrimary}
        />
      </ChartContainer>
    </HardwareInfoContainer>
  );
};
