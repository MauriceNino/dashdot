import { Config, StorageInfo, StorageLoad } from '@dash/common';
import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { Variants } from 'framer-motion';
import { FC, useMemo, useState } from 'react';
import { Bar, Cell, LabelList } from 'recharts';
import { useTheme } from 'styled-components';
import {
  DefaultPieChart,
  DefaultVertBarChart,
  VertBarStartLabel,
} from '../components/chart-components';
import {
  ChartContainer,
  MultiChartContainer,
} from '../components/chart-container';
import { HardwareInfoContainer } from '../components/hardware-info-container';
import { ThemedText } from '../components/text';
import { WidgetSwitch } from '../components/widget-switch';
import { useIsMobile } from '../services/mobile';
import { useSetting } from '../services/settings';
import { bytePrettyPrint } from '../utils/calculations';
import { toInfoTable } from '../utils/format';

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

const removeDuplicates = (arr: string[]): string => {
  const amounts: Record<string, number> = {};
  for (const el of arr) {
    if (amounts[el]) amounts[el] = amounts[el] + 1;
    else amounts[el] = 1;
  }

  return Object.entries(amounts)
    .map(([key, val]) => (val === 1 ? key : `${val}x ${key}`))
    .join(', ');
};

const useStorageLayout = (data: StorageInfo, config: Config) => {
  const override = config.override;

  return useMemo(
    () =>
      data.layout.reduce(
        (acc, curr, i) => {
          const existing = acc.find(
            o =>
              curr.raidGroup != null &&
              curr.raidGroup !== '' &&
              o.raidGroup === curr.raidGroup
          );

          if (existing) {
            existing.brands = [
              ...existing.brands,
              override.storage_brands[i] ?? curr.brand,
            ];
            existing.types = [
              ...existing.types,
              override.storage_types[i] ?? curr.type,
            ];
          } else {
            acc.push({
              brands: [override.storage_brands[i] ?? curr.brand],
              types: [override.storage_types[i] ?? curr.type],
              size: override.storage_sizes[i] ?? curr.size,
              raidGroup: curr.raidGroup,
              virtual: curr.virtual,
            });
          }

          return acc;
        },
        [] as {
          brands: string[];
          types: string[];
          size: number;
          raidGroup?: string;
          virtual?: boolean;
        }[]
      ),
    [
      data.layout,
      override.storage_brands,
      override.storage_sizes,
      override.storage_types,
    ]
  );
};

type StorageChartProps = {
  load?: StorageLoad;
  index?: number;
  data: StorageInfo;
  config: Config;
  multiView: boolean;
  showPercentages: boolean;
  textOffset?: string;
  textSize?: string;
};
export const StorageChart: FC<StorageChartProps> = ({
  load,
  index,
  data,
  config,
  multiView,
  showPercentages,
  textOffset,
  textSize,
}) => {
  const theme = useTheme();
  const layout = useStorageLayout(data, config);
  const layoutNoVirtual = layout.filter(l => !l.virtual);

  const totalSize = layoutNoVirtual.reduce((acc, s) => (acc = acc + s.size), 0);
  const totalUsed =
    load?.layout
      .slice(0, layoutNoVirtual.length)
      .reduce((acc, { load }) => acc + load, 0) ?? 0;
  const totalAvailable = Math.max(0, totalSize - totalUsed);

  const usageArr = useMemo(() => {
    if (!multiView) return [];

    let alreadyAdded = 0;
    return layout
      .reduce(
        (acc, curr) => {
          const diskLoad = curr.brands.reduce(
            (acc, _, i) =>
              acc === 0 ? load?.layout[alreadyAdded + i]?.load ?? 0 : acc,
            0
          );
          const diskSize = curr.size;

          const existing = acc.find(
            o =>
              curr.raidGroup != null &&
              curr.raidGroup !== '' &&
              o.raidGroup === curr.raidGroup
          );

          if (existing) {
            existing.used = existing.used + diskLoad;
          } else {
            acc.push({
              used: diskLoad,
              available: diskSize - diskLoad,
            });
          }

          alreadyAdded += curr.brands.length;
          return acc;
        },
        [] as {
          raidGroup?: string;
          used: number;
          available: number;
        }[]
      )
      .map(({ used, available }) => {
        const realPercent = used / (used + available),
          usedPercent = Math.min(realPercent, 1);

        return {
          used,
          available,
          realPercent,
          usedPercent,
          availablePercent: 1 - usedPercent,
        };
      });
  }, [layout, load?.layout, multiView]);

  return (
    <MultiChartContainer layout>
      {multiView ? (
        <ChartContainer
          variants={itemVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          key='storage-chart-multi'
          contentLoaded={load != null}
          renderChart={size => (
            <DefaultVertBarChart
              width={size.width}
              height={size.height}
              data={
                index != null
                  ? usageArr.slice(index * 3, index * 3 + 3)
                  : usageArr
              }
              tooltipRenderer={x => {
                const value = x.payload?.[0]?.payload as
                  | (typeof usageArr)[0]
                  | undefined;

                if (!value) {
                  return <ThemedText>? % Used</ThemedText>;
                }

                return (
                  <>
                    <ThemedText>
                      {(value.realPercent * 100).toFixed(1)} % Used
                    </ThemedText>

                    <ThemedText>
                      {bytePrettyPrint(value.used)} /{' '}
                      {bytePrettyPrint(value.available + value.used)}
                    </ThemedText>
                  </>
                );
              }}
            >
              <Bar
                dataKey='usedPercent'
                stackId='stack'
                fill={theme.colors.storagePrimary}
                style={{ stroke: theme.colors.surface, strokeWidth: 4 }}
                radius={10}
                isAnimationActive={!showPercentages}
              >
                {showPercentages && (
                  <LabelList
                    position='insideLeft'
                    offset={15}
                    dataKey='realPercent'
                    content={
                      <VertBarStartLabel
                        labelRenderer={value =>
                          `%: ${(value * 100).toFixed(1)}`
                        }
                      />
                    }
                  />
                )}
              </Bar>
              <Bar
                dataKey='availablePercent'
                stackId='stack'
                fill={theme.colors.text}
                style={{ stroke: theme.colors.surface, strokeWidth: 4 }}
                opacity={0.2}
                radius={10}
              />
            </DefaultVertBarChart>
          )}
        ></ChartContainer>
      ) : (
        <ChartContainer
          textLeft={
            showPercentages
              ? `%: ${((totalUsed / totalSize) * 100).toFixed(1)}`
              : undefined
          }
          textOffset={textOffset}
          textSize={textSize}
          variants={itemVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          key='storage-chart-single'
          contentLoaded={load != null}
          renderChart={size => (
            <DefaultPieChart
              data={[
                {
                  name: 'Used',
                  value: totalUsed,
                },
                {
                  name: 'Free',
                  value: totalAvailable,
                },
              ]}
              width={size.width}
              height={size.height}
              color={theme.colors.storagePrimary}
              hoverLabelRenderer={(label, value) =>
                `${((value / totalSize) * 100).toFixed(
                  1
                )} % ${label}\n${bytePrettyPrint(value)} / ${bytePrettyPrint(
                  totalSize
                )}`
              }
            >
              <Cell
                key='cell-used'
                fill={theme.colors.storagePrimary}
                style={{
                  transition: 'all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              />
              <Cell
                key='cell-free'
                fill={theme.colors.text}
                opacity={0.2}
                style={{
                  transition: 'all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              />
            </DefaultPieChart>
          )}
        ></ChartContainer>
      )}
    </MultiChartContainer>
  );
};

type StorageWidgetProps = {
  load?: StorageLoad;
  data: StorageInfo;
  config: Config;
};

export const StorageWidget: FC<StorageWidgetProps> = ({
  load,
  data,
  config,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(0);
  const layout = useStorageLayout(data, config);

  const [splitView, setSplitView] = useSetting('splitStorage', false);
  const canHaveSplitView = layout.length > 1;

  const infos = useMemo(() => {
    if (layout.length > 1) {
      return layout.map(s => {
        const brand = s.virtual
          ? s.brands[0]
          : removeDuplicates(
              s.brands.map((b, i) => `${b || 'Unknown'} ${s.types[i]}`)
            );
        const size = s.size;
        const raidGroup = s.raidGroup;

        return {
          label: s.virtual
            ? 'VIRT'
            : raidGroup
            ? `RAID\n=> ${raidGroup}`
            : 'Drive',
          value: `${brand}\n=> ${bytePrettyPrint(size)}`,
        };
      });
    } else {
      const brand = removeDuplicates(layout[0]?.brands);
      const size = layout[0]?.size;
      const type = removeDuplicates(layout[0]?.types);
      const isRaid = layout[0]?.raidGroup != null;

      return toInfoTable(
        isRaid
          ? config.storage_label_list
          : config.storage_label_list.filter(x => x !== 'raid'),
        {
          brand: 'Brand',
          size: 'Size',
          type: 'Type',
          raid: 'Raid',
        },
        [
          {
            key: 'brand',
            value: brand,
          },
          {
            key: 'size',
            value: size ? bytePrettyPrint(size) : '',
          },
          {
            key: 'type',
            value: type,
          },
          {
            key: 'raid',
            value: layout[0]?.raidGroup,
          },
        ]
      );
    }
  }, [config.storage_label_list, layout]);

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      heading='Storage'
      infos={infos}
      infosPerPage={layout.length > 1 ? 3 : 7}
      icon={faHdd}
      extraContent={
        canHaveSplitView ? (
          <WidgetSwitch
            label='Split View'
            checked={splitView}
            onChange={() => setSplitView(!splitView)}
          />
        ) : undefined
      }
      onPageChange={setPage}
    >
      <StorageChart
        showPercentages={config.always_show_percentages || isMobile}
        load={load}
        index={page}
        config={config}
        data={data}
        multiView={canHaveSplitView && splitView}
      />
    </HardwareInfoContainer>
  );
};
