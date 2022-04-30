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

  const manufacturer = removeDuplicates(
    override?.ram_brand
      ? [override?.ram_brand]
      : data?.layout?.map(l => l.manufacturer)
  );
  const type = removeDuplicates(
    override?.ram_type ? [override?.ram_type] : data?.layout?.map(l => l.type)
  );
  const clockSpeed = removeDuplicates(
    override?.ram_speed
      ? [override?.ram_speed]
      : data?.layout?.map(l => l.clockSpeed).filter(c => c !== 0)
  );

  const chartData = load.map((load, i) => ({
    x: i,
    y: (byteToGb(load) / byteToGb(data?.total ?? 1)) * 100,
  })) as Datum[];

  return (
    <HardwareInfoContainer
      color={theme.colors.ramPrimary}
      contentLoaded={chartData.length > 1}
      heading='Memory'
      infosLoading={loading}
      infos={[
        {
          label: 'Brand' + (manufacturer.length > 1 ? '(s)' : ''),
          value: manufacturer.join(', '),
        },
        {
          label: 'Size',
          value:
            override?.ram_size || data?.total
              ? `${byteToGb(override?.ram_size ?? data?.total ?? 0)} GB`
              : '',
        },
        {
          label: 'Type' + (type.length > 1 ? '(s)' : ''),
          value: type.join(', '),
        },
        {
          label: 'Speed' + (clockSpeed.length > 1 ? '(s)' : ''),
          value: clockSpeed.join(', '),
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
