import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { linearGradientDef } from '@nivo/core';
import { Datum, ResponsiveLine, Serie } from '@nivo/line';
import { Switch } from 'antd';
import { Config, CpuInfo, CpuLoad } from 'dashdot-shared';
import { FC, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';

const CpuSwitchContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  z-index: 2;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

type CpuWidgetProps = {
  load: CpuLoad[];
  loading: boolean;
  data?: CpuInfo;
  config?: Config;
};

const CpuWidget: FC<CpuWidgetProps> = ({ load, loading, data, config }) => {
  const theme = useTheme();
  const override = config?.override;

  const [showThreads, setShowThreads] = useState(false);

  // TODO: calculate the chart values only once per time-frame
  let chartData: Serie[] = [];

  if (showThreads) {
    const coresWithValues = load.reduce(
      (acc, curr) => {
        curr.forEach(({ load: l, core }) => {
          if (acc[core])
            acc[core] = acc[core].concat({
              x: acc[core].length,
              y: l,
            });
          else
            acc[core] = [
              {
                x: 0,
                y: l,
              },
            ];
        });

        return acc;
      },
      {} as {
        [key: number]: Datum[];
      }
    );

    chartData = Object.entries(coresWithValues).map(([key, value]) => ({
      id: key,
      data: value,
    }));
  } else {
    const chartValues: Datum[] = load.reduce((acc, curr, i) => {
      const avgLoad =
        curr.reduce((acc, curr) => acc + curr.load, 0) / curr.length;

      acc.push({
        x: i,
        y: avgLoad,
      });
      return acc;
    }, [] as Datum[]);

    chartData = [
      {
        id: 'cpu',
        data: chartValues,
      },
    ];
  }

  const frequency = override?.cpu_frequency ?? data?.frequency;

  return (
    <HardwareInfoContainer
      color={theme.colors.cpuPrimary}
      contentLoaded={chartData.some(serie => serie.data.length > 1)}
      heading='Processor'
      infosLoading={loading}
      infos={[
        {
          label: 'Brand',
          value: override?.cpu_brand ?? data?.brand,
        },
        {
          label: 'Model',
          value: override?.cpu_model ?? data?.model,
        },
        {
          label: 'Cores',
          value: (override?.cpu_cores ?? data?.cores)?.toString(),
        },
        {
          label: 'Threads',
          value: (override?.cpu_threads ?? data?.threads)?.toString(),
        },
        {
          label: 'Frequency',
          value: frequency ? `${frequency} GHz` : '',
        },
      ]}
      icon={faMicrochip}
      extraContent={
        <CpuSwitchContainer>
          <ThemedText>Show All Cores</ThemedText>
          <Switch
            checked={showThreads}
            onChange={() => setShowThreads(!showThreads)}
          />
        </CpuSwitchContainer>
      }
    >
      <ResponsiveLine
        isInteractive={true}
        enableSlices='x'
        sliceTooltip={props => {
          //TODO: correct calculation for multi-core
          const point = props.slice.points[0];
          return (
            <ThemedText>
              {Math.round((point.data.y as number) * 100) / 100} %
            </ThemedText>
          );
        }}
        data={chartData}
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
        colors={theme.colors.cpuPrimary}
      />
    </HardwareInfoContainer>
  );
};

export default CpuWidget;
