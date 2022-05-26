import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { linearGradientDef } from '@nivo/core';
import { Datum, ResponsiveLine, Serie } from '@nivo/line';
import { Switch } from 'antd';
import { Config, CpuInfo, CpuLoad } from 'dashdot-shared';
import { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { ChartContainer } from '../components/chart-container';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { useSetting } from '../services/settings';
import { toCommas } from '../utils/calculations';

const getColumnsForCores = (cores: number): number => {
  let columns = 1;
  for (let i = 0; i < cores - 1; i++) {
    if (cores % i === 0) {
      columns = i;

      if (columns >= cores / i) return columns;
    }
  }

  return columns;
};

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

const TempContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  z-index: 2;
  color: ${({ theme }) => theme.colors.text}AA;
  white-space: nowrap;
`;

type CpuWidgetProps = {
  load: CpuLoad[];
  data?: CpuInfo;
  config?: Config;
};

export const CpuWidget: FC<CpuWidgetProps> = ({ load, data, config }) => {
  const theme = useTheme();
  const override = config?.override;
  const latestLoad = load[load.length - 1];

  const [multiCore, setMulticore] = useSetting('multiCore', false);

  let chartData: Serie[][] = [];

  if (multiCore) {
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

    chartData = Object.entries(coresWithValues).map(([_, value]) => [
      {
        id: 'cpu',
        data: value,
      },
    ]);
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
      [
        {
          id: 'cpu',
          data: chartValues,
        },
      ],
    ];
  }

  const frequency = override?.cpu_frequency ?? data?.frequency;

  const averageTemp =
    latestLoad?.reduce((acc, { temp }) => acc + (temp ?? 0), 0) /
    latestLoad?.length;

  const columns = getColumnsForCores(latestLoad?.length ?? 1);

  return (
    <HardwareInfoContainer
      columns={multiCore ? columns : 1}
      gap={8}
      color={theme.colors.cpuPrimary}
      heading='Processor'
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
            checked={multiCore}
            onChange={() => setMulticore(!multiCore)}
          />
        </CpuSwitchContainer>
      }
    >
      {chartData.map((chart, chartI) => (
        <ChartContainer
          key={chartI.toString() + multiCore?.toString()}
          contentLoaded={chart.some(serie => serie.data.length > 1)}
          edges={
            multiCore
              ? [
                  chartI === 0,
                  chartI === columns - 1,
                  chartI === chartData.length - 1,
                  chartI === chartData.length - columns,
                ]
              : undefined
          }
          statText={
            multiCore
              ? undefined
              : `%: ${(
                  chart[0].data[chart[0].data.length - 1]?.y as number
                )?.toFixed(1)}`
          }
        >
          {config?.enable_cpu_temps &&
            !multiCore &&
            chart.some(serie => serie.data.length > 1) && (
              <TempContainer>
                {`Ø: ${
                  (multiCore
                    ? latestLoad[chartI].temp
                    : averageTemp.toFixed(1)) || '?'
                } °C`}
              </TempContainer>
            )}
          <ResponsiveLine
            isInteractive={true}
            enableSlices='x'
            sliceTooltip={props => {
              const point = props.slice.points[0];
              return (
                <ThemedText>{toCommas(point.data.y as number, 2)} %</ThemedText>
              );
            }}
            data={chart}
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
        </ChartContainer>
      ))}
    </HardwareInfoContainer>
  );
};
