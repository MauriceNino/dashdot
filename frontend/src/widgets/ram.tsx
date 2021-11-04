import { faMemory } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { linearGradientDef } from '@nivo/core';
import { Datum, ResponsiveLine } from '@nivo/line';
import { RamInfo, RamLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { removeDuplicates } from '../utils/array-utils';
import { byteToGb } from '../utils/calculations';

type RamWidgetProps = {
  load: RamLoad[];
  loading: boolean;
} & Partial<RamInfo>;

const RamWidget: FC<RamWidgetProps> = props => {
  const theme = useTheme();

  const manufacturer = removeDuplicates(props.layout?.map(l => l.manufacturer));
  const type = removeDuplicates(props.layout?.map(l => l.type));
  const clockSpeed = removeDuplicates(
    props.layout?.map(l => l.clockSpeed).filter(c => c !== 0)
  );

  const chartData = props.load.map((load, i) => ({
    x: i,
    y: (byteToGb(load) / byteToGb(props.total ?? 1)) * 100,
  })) as Datum[];

  return (
    <HardwareInfoContainer
      color={theme.colors.ramPrimary}
      contentLoaded={chartData.length > 1}
      heading='Memory'
      infosLoading={props.loading}
      infos={[
        {
          label: 'Brand' + (manufacturer.length > 1 ? '(s)' : ''),
          value: manufacturer.join(', '),
        },
        {
          label: 'Size',
          value: props.total ? `${byteToGb(props.total)} GB` : '',
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
