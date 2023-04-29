import { Config, GpuInfo, GpuLoad } from '@dash/common';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FC, useMemo, useState } from 'react';
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
import { ChartVal } from '../utils/types';

type GpuChartProps = {
  load: GpuLoad[];
  index: number;
  showPercentages: boolean;
  textOffset?: string;
  textSize?: string;
};

export const GpuChart: FC<GpuChartProps> = ({
  load,
  index,
  showPercentages,
  textOffset,
  textSize,
}) => {
  const theme = useTheme();

  const chartDataLoad = load.map((load, i) => ({
    x: i,
    y: load.layout[index].load,
  })) as ChartVal[];
  const chartDataMemory = load.map((load, i) => ({
    x: i,
    y: load.layout[index].memory,
  })) as ChartVal[];

  return (
    <MultiChartContainer columns={2}>
      <ChartContainer
        contentLoaded={chartDataLoad.length > 1}
        textLeft={
          showPercentages
            ? `%: ${(
                chartDataLoad[chartDataLoad.length - 1]?.y as number
              )?.toFixed(1)} (Load)`
            : undefined
        }
        textOffset={textOffset}
        textSize={textSize}
        renderChart={size => (
          <DefaultAreaChart
            data={chartDataLoad}
            height={size.height}
            width={size.width}
            color={theme.colors.gpuPrimary}
            renderTooltip={val => `${val.payload?.[0]?.value?.toFixed(1)} %`}
          >
            <YAxis hide={true} type='number' domain={[-5, 105]} />
          </DefaultAreaChart>
        )}
      ></ChartContainer>

      <ChartContainer
        contentLoaded={chartDataMemory.length > 1}
        textLeft={`%: ${(
          chartDataMemory[chartDataMemory.length - 1]?.y as number
        )?.toFixed(1)} (Memory)`}
        textOffset={textOffset}
        textSize={textSize}
        renderChart={size => (
          <DefaultAreaChart
            data={chartDataMemory}
            height={size.height}
            width={size.width}
            color={theme.colors.gpuPrimary}
            renderTooltip={val => `${val.payload?.[0]?.value?.toFixed(1)} %`}
          >
            <YAxis hide={true} type='number' domain={[-5, 105]} />
          </DefaultAreaChart>
        )}
      ></ChartContainer>
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
    ]
  );

  return (
    <HardwareInfoContainer
      color={theme.colors.gpuPrimary}
      heading='Graphics'
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
