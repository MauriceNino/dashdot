import type { Config, GpuInfo, GpuLoad } from '@dashdot/common';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { type FC, useMemo, useState } from 'react';
import { YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { DefaultAreaChart } from '../components/chart-components';
import {
  ChartContainer,
  MultiChartContainer,
} from '../components/chart-container';
import { HardwareInfoContainer } from '../components/hardware-info-container';
import { useIsMobile } from '../services/mobile';
import { bytePrettyPrint } from '../utils/calculations';
import { toInfoTable } from '../utils/format';
import type { ChartVal } from '../utils/types';

type EngineGridLayout = {
  rows?: number;
  gridTemplateColumns: string;
};

const ENGINE_GRID_LAYOUTS: Record<number, EngineGridLayout> = {
  2: { gridTemplateColumns: '1fr 1fr' },
  3: { gridTemplateColumns: '1fr 1fr 1fr' },
  4: { gridTemplateColumns: '1fr 1fr', rows: 2 },
  5: { gridTemplateColumns: '2fr 1fr 1fr', rows: 2 },
};

type GpuChartProps = {
  load: GpuLoad[];
  index: number;
  showPercentages: boolean;
  textOffset?: string;
  textSize?: string;
  filter?: string;
};

export const GpuChart: FC<GpuChartProps> = ({
  load,
  index,
  showPercentages,
  textOffset,
  textSize,
  filter,
}) => {
  const theme = useTheme();

  const engineNames = useMemo(() => {
    const engines = load.at(-1)?.layout[index]?.engines;
    return engines ? Object.keys(engines) : null;
  }, [load, index]);

  if (engineNames && engineNames.length > 0) {
    const featuredName =
      engineNames.length === 5
        ? engineNames.includes('Video')
          ? 'Video'
          : engineNames[0]
        : null;

    const sortedNames = featuredName
      ? [featuredName, ...engineNames.filter((n) => n !== featuredName)]
      : engineNames;

    const gridProps = ENGINE_GRID_LAYOUTS[engineNames.length] ?? { gridTemplateColumns: `repeat(${engineNames.length}, 1fr)` };

    const engineCharts = sortedNames.map((name, idx) => {
      const isFeatured = idx === 0 && featuredName !== null;
      const chartData = load.map((l, i) => ({
        x: i,
        y: l.layout[index]?.engines?.[name] ?? 0,
      })) as ChartVal[];
      return (
        <ChartContainer
          key={name}
          contentLoaded={chartData.length > 1}
          textLeft={
            showPercentages
              ? `%: ${(chartData.at(-1)?.y as number)?.toFixed(1)} (${name})`
              : name
          }
          textOffset={textOffset}
          textSize={isFeatured ? textSize : '0.8em'}
          style={isFeatured ? { gridRow: 'span 2' } : undefined}
          renderChart={(size) => (
            <DefaultAreaChart
              data={chartData}
              height={size.height}
              width={size.width}
              color={theme.colors.gpuPrimary}
              renderTooltip={(val) =>
                `${val.payload?.[0]?.value?.toFixed(1)} %`
              }
            >
              <YAxis hide={true} type="number" domain={[-5, 105]} />
            </DefaultAreaChart>
          )}
        />
      );
    });

    if (filter) {
      const primaryChart = engineCharts[sortedNames.indexOf(featuredName ?? sortedNames[0])];
      return (
        <MultiChartContainer columns={1}>{primaryChart}</MultiChartContainer>
      );
    }

    return (
      <MultiChartContainer {...gridProps}>{engineCharts}</MultiChartContainer>
    );
  }

  const chartDataLoad = load.map((load, i) => ({
    x: i,
    y: load.layout[index].load,
  })) as ChartVal[];
  const chartDataMemory = load.map((load, i) => ({
    x: i,
    y: load.layout[index].memory,
  })) as ChartVal[];

  const chartLoad = (
    <ChartContainer
      contentLoaded={chartDataLoad.length > 1}
      textLeft={
        showPercentages
          ? `%: ${(chartDataLoad.at(-1)?.y as number)?.toFixed(1)} (Load)`
          : undefined
      }
      textOffset={textOffset}
      textSize={textSize}
      renderChart={(size) => (
        <DefaultAreaChart
          data={chartDataLoad}
          height={size.height}
          width={size.width}
          color={theme.colors.gpuPrimary}
          renderTooltip={(val) => `${val.payload?.[0]?.value?.toFixed(1)} %`}
        >
          <YAxis hide={true} type="number" domain={[-5, 105]} />
        </DefaultAreaChart>
      )}
    ></ChartContainer>
  );

  const chartMemory = (
    <ChartContainer
      contentLoaded={chartDataMemory.length > 1}
      textLeft={`%: ${(chartDataMemory.at(-1)?.y as number)?.toFixed(
        1,
      )} (Memory)`}
      textOffset={textOffset}
      textSize={textSize}
      renderChart={(size) => (
        <DefaultAreaChart
          data={chartDataMemory}
          height={size.height}
          width={size.width}
          color={theme.colors.gpuPrimary}
          renderTooltip={(val) => `${val.payload?.[0]?.value?.toFixed(1)} %`}
        >
          <YAxis hide={true} type="number" domain={[-5, 105]} />
        </DefaultAreaChart>
      )}
    ></ChartContainer>
  );

  if (filter === 'load')
    return <MultiChartContainer columns={1}>{chartLoad}</MultiChartContainer>;
  else if (filter === 'memory')
    return <MultiChartContainer columns={1}>{chartMemory}</MultiChartContainer>;
  else
    return (
      <MultiChartContainer columns={2}>
        {chartLoad}
        {chartMemory}
      </MultiChartContainer>
    );
};

type GpuWidgetProps = {
  load: GpuLoad[];
  data: GpuInfo;
  config: Config;
};

export const GpuWidget: FC<GpuWidgetProps> = ({ load, data, config }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(0);
  const override = config.override;

  const infos = useMemo(
    () =>
      data.layout.flatMap((gpu, i) => {
        const brand = override.gpu_brands[i] ?? gpu.brand;
        const model = override.gpu_models[i] ?? gpu.model;
        const memory = override.gpu_memories[i] ?? gpu.memory;

        return toInfoTable(config.gpu_label_list, {
          brand: { label: 'Brand', value: brand },
          model: { label: 'Model', value: model },
          memory: {
            label: 'Memory',
            value: memory ? bytePrettyPrint(memory * 1024 * 1024) : memory,
          },
        });
      }),
    [
      config.gpu_label_list,
      data.layout,
      override.gpu_brands,
      override.gpu_memories,
      override.gpu_models,
    ],
  );

  return (
    <HardwareInfoContainer
      color={theme.colors.gpuPrimary}
      heading="Graphics"
      infos={infos}
      infosPerPage={config.gpu_label_list.length}
      icon={faDesktop}
      onPageChange={setPage}
    >
      <GpuChart
        showPercentages={config.always_show_percentages || isMobile}
        load={load}
        index={page}
      />
    </HardwareInfoContainer>
  );
};
