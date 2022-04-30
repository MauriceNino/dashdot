import { faMemory } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { linearGradientDef } from '@nivo/core';
import { Datum, ResponsiveLine } from '@nivo/line';
import { Config, RamInfo, RamLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { removeDuplicates } from '../utils/array-utils';
import { byteToGb } from '../utils/calculations';

type RamWidgetProps = {
  load: RamLoad[];
  loading: boolean;
  data?: RamInfo;
  config?: Config;
};

const RamWidget: FC<RamWidgetProps> = ({ load, loading, data, config }) => {
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
      : data?.layout?.map(l => l.frequency).filter(c => c !== 0)
  ).map(s => `${s} MHz`);

  const chartData = load.map((load, i) => ({
    x: i,
    y: (byteToGb(load) / byteToGb(data?.size ?? 1)) * 100,
  })) as Datum[];

  return (
    <HardwareInfoContainer
      color={theme.colors.ramPrimary}
      contentLoaded={chartData.length > 1}
      heading='Memory'
      infosLoading={loading}
      infos={[
        {
          label: brands.length > 1 ? 'Brands' : 'Brand',
          value: brands.join(', '),
        },
        {
          label: 'Size',
          value: size ? `${byteToGb(size)} GB` : '',
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
      <ResponsiveLine
        isInteractive={true}
        enableSlices='x'
        sliceTooltip={props => {
          const point = props.slice.points[0];
          return (
            <ThemedText>
              {Math.round((point.data.y as number) * 100) / 100} %
            </ThemedText>
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
    </HardwareInfoContainer>
  );
};

export default RamWidget;
