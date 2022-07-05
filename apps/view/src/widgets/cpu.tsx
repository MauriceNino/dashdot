import { Config, CpuInfo, CpuLoad } from '@dash/common';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { Variants } from 'framer-motion';
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
import { WidgetSwitch } from '../components/widget-switch';
import { useIsMobile } from '../services/mobile';
import { useSetting } from '../services/settings';
import { celsiusToFahrenheit } from '../utils/calculations';
import { toInfoTable } from '../utils/format';
import { ChartVal } from '../utils/types';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

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

type CpuChartProps = {
  load: CpuLoad[];
  config: Config;
  multiView: boolean;
  showPercentages: boolean;
};
export const CpuChart: FC<CpuChartProps> = ({
  load,
  config,
  multiView,
  showPercentages,
}) => {
  const theme = useTheme();

  const latestLoad = load[load.length - 1];
  const columns = getColumnsForCores(latestLoad?.length ?? 1);
  let chartData: ChartVal[][] = [];

  if (multiView) {
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
        [key: number]: ChartVal[];
      }
    );

    chartData = Object.entries(coresWithValues).map(([_, value]) => value);
  } else {
    const chartValues: ChartVal[] = load.reduce((acc, curr, i) => {
      const avgLoad =
        curr.reduce((acc, curr) => acc + curr.load, 0) / curr.length;

      acc.push({
        x: i,
        y: avgLoad,
      });
      return acc;
    }, [] as ChartVal[]);

    chartData = [chartValues];
  }
  const averageTemp =
    latestLoad?.reduce((acc, { temp }) => acc + (temp ?? 0), 0) /
    latestLoad?.length;

  return (
    <MultiChartContainer
      columns={multiView ? columns : 1}
      gap={8}
      layout
      variants={containerVariants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      {chartData.map((chart, chartI) => (
        <ChartContainer
          key={chartI.toString() + multiView?.toString()}
          variants={itemVariants}
          contentLoaded={chart.length > 1}
          edges={
            multiView
              ? [
                  chartI === 0,
                  chartI === columns - 1,
                  chartI === chartData.length - 1,
                  chartI === chartData.length - columns,
                ]
              : undefined
          }
          textLeft={
            multiView || !showPercentages
              ? undefined
              : `%: ${((chart.at(-1)?.y as number) ?? 0)?.toFixed(1)}`
          }
          textRight={
            config.enable_cpu_temps && !multiView && chart.length > 1
              ? `Ø: ${
                  (config.use_imperial
                    ? celsiusToFahrenheit(averageTemp).toFixed(1)
                    : averageTemp.toFixed(1)) || '?'
                } ${config.use_imperial ? '°F' : '°C'}`
              : undefined
          }
          renderChart={size => (
            <DefaultAreaChart
              data={chart}
              height={size.height}
              width={size.width}
              color={theme.colors.cpuPrimary}
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
      ))}
    </MultiChartContainer>
  );
};

type CpuWidgetProps = {
  load: CpuLoad[];
  data: CpuInfo;
  config: Config;
};

export const CpuWidget: FC<CpuWidgetProps> = ({ load, data, config }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const override = config.override;

  const [multiCore, setMulticore] = useSetting('multiCore', false);
  const frequency = override.cpu_frequency ?? data.frequency;

  return (
    <HardwareInfoContainer
      color={theme.colors.cpuPrimary}
      heading='Processor'
      infos={toInfoTable(
        config.cpu_label_list,
        {
          brand: 'Brand',
          model: 'Model',
          cores: 'Cores',
          threads: 'Threads',
          frequency: 'Frequency',
        },
        [
          {
            key: 'brand',
            value: override.cpu_brand ?? data.brand,
          },
          {
            key: 'model',
            value: override.cpu_model ?? data.model,
          },
          {
            key: 'cores',
            value: (override.cpu_cores ?? data.cores)?.toString(),
          },
          {
            key: 'threads',
            value: (override.cpu_threads ?? data.threads)?.toString(),
          },
          {
            key: 'frequency',
            value: frequency ? `${frequency} GHz` : '',
          },
        ]
      )}
      infosPerPage={7}
      icon={faMicrochip}
      extraContent={
        <WidgetSwitch
          label='Show All Cores'
          checked={multiCore}
          onChange={() => setMulticore(!multiCore)}
        />
      }
    >
      <CpuChart
        showPercentages={config.always_show_percentages || isMobile}
        multiView={multiCore}
        config={config}
        load={load}
      />
    </HardwareInfoContainer>
  );
};
