import { Config, GpuInfo, GpuLoad } from '@dash/common';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { Datum } from '@nivo/line';
import { FC, useMemo, useState } from 'react';
import { Tooltip, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { DefaultAreaChart } from '../components/chart-components';
import { ChartContainer } from '../components/chart-container';
import { HardwareInfoContainer } from '../components/hardware-info-container';
import { ThemedText } from '../components/text';
import { bytePrettyPrint } from '../utils/calculations';
import { toInfoTable } from '../utils/format';

type GpuWidgetProps = {
  load: GpuLoad[];
  data: GpuInfo;
  config: Config;
};

export const GpuWidget: FC<GpuWidgetProps> = ({ load, data, config }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const override = config.override;

  const infos = useMemo(
    () =>
      data.layout.flatMap((gpu, i) => {
        const brand = override.gpu_brands[i] ?? gpu.brand;
        const model = override.gpu_models[i] ?? gpu.model;
        const memory = override.gpu_memories[i] ?? gpu.memory;

        return toInfoTable(
          config.gpu_label_list,
          {
            brand: 'Brand',
            model: 'Model',
            memory: 'Memory',
          },
          [
            {
              key: 'brand',
              value: brand,
            },
            {
              key: 'model',
              value: model,
            },
            {
              key: 'memory',
              value: memory ? bytePrettyPrint(memory * 1024 * 1024) : memory,
            },
          ]
        );
      }),
    [
      config.gpu_label_list,
      data.layout,
      override.gpu_brands,
      override.gpu_memories,
      override.gpu_models,
    ]
  );

  const chartDataLoad = load.map((load, i) => ({
    x: i,
    y: load.layout[page].load,
  })) as Datum[];
  const chartDataMemory = load.map((load, i) => ({
    x: i,
    y: load.layout[page].memory,
  })) as Datum[];

  return (
    <HardwareInfoContainer
      columns={2}
      color={theme.colors.gpuPrimary}
      heading='Graphics'
      infos={infos}
      infosPerPage={config.gpu_label_list.length}
      icon={faDesktop}
      onPageChange={setPage}
    >
      <ChartContainer
        contentLoaded={chartDataLoad.length > 1}
        statText={`%: ${(chartDataLoad.at(-1)?.y as number)?.toFixed(
          1
        )} (Load)`}
      >
        {size => (
          <DefaultAreaChart
            data={chartDataLoad}
            height={size.height}
            width={size.width}
            color={theme.colors.gpuPrimary}
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
      </ChartContainer>

      <ChartContainer
        contentLoaded={chartDataMemory.length > 1}
        statText={`%: ${(chartDataMemory.at(-1)?.y as number)?.toFixed(
          1
        )} (Memory)`}
      >
        {size => (
          <DefaultAreaChart
            data={chartDataMemory}
            height={size.height}
            width={size.width}
            color={theme.colors.gpuPrimary}
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
      </ChartContainer>
    </HardwareInfoContainer>
  );
};
