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

const useDataWithOverrides = (data: StorageInfo, config: Config): StorageInfo =>
  useMemo(
    () =>
      data.map(entry => {
        const sizeDevice = entry.disks.find(
          disk => config.override.storage_sizes[disk.device] != null
        )?.device;

        return {
          ...entry,
          size: sizeDevice
            ? config.override.storage_sizes[sizeDevice]
            : entry.size,
          disks: entry.disks.map(disk => ({
            ...disk,
            brand: config.override.storage_brands[disk.device] ?? disk.brand,
            type: config.override.storage_types[disk.device] ?? disk.type,
          })),
        };
      }),
    [data, config]
  );

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

  const shownData = useDataWithOverrides(data, config);
  const layoutNoVirtual = shownData.filter(l => !l.virtual);

  const totalSize = layoutNoVirtual.reduce((acc, s) => (acc = acc + s.size), 0);
  const totalUsed =
    load
      ?.slice(0, layoutNoVirtual.length)
      .reduce((acc, curr) => acc + curr, 0) ?? 0;
  const totalAvailable = Math.max(0, totalSize - totalUsed);

  const usageArr = useMemo(() => {
    if (!multiView) return [];

    return shownData.map((d, i) => {
      const used = load?.[i] ?? 0;
      const available = d.size - used;
      const realPercent = used / d.size,
        usedPercent = Math.min(realPercent, 1);

      return {
        used,
        available,
        realPercent,
        usedPercent,
        availablePercent: 1 - usedPercent,
      };
    });
  }, [shownData, load, multiView]);

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
                  ? usageArr.slice(
                      index * config.storage_widget_items_per_page,
                      index * config.storage_widget_items_per_page +
                        config.storage_widget_items_per_page
                    )
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

  const [splitView, setSplitView] = useSetting('splitStorage', false);
  const shownData = useDataWithOverrides(data, config);
  const canHaveSplitView = shownData.length > 1;

  const infos = useMemo(() => {
    if (shownData.length > 1) {
      const brandShown = config.storage_label_list.includes('brand');
      const typeShown = config.storage_label_list.includes('type');
      const sizeShown = config.storage_label_list.includes('size');
      const raidShown = config.storage_label_list.includes('raid');

      return shownData.map(s => {
        const brand = s.virtual
          ? s.disks[0].brand
          : removeDuplicates(
              s.disks.map(d =>
                [
                  brandShown ? d.brand : undefined,
                  typeShown ? d.type : undefined,
                ]
                  .filter(x => x)
                  .join(' ')
              )
            );
        const size = s.size;
        const raidGroup = s.raidLabel;

        return {
          label: s.virtual
            ? 'VIRT'
            : raidGroup
            ? `RAID${raidShown ? `\n=> ${raidGroup}` : ''}`
            : 'Drive',
          value: [
            brandShown || typeShown ? brand : undefined,
            sizeShown ? bytePrettyPrint(size) : undefined,
          ]
            .filter(x => x)
            .join('\n=> '),
        };
      });
    } else {
      const brand = removeDuplicates(
        shownData[0]?.disks?.map(({ brand }) => brand)
      );
      const size = shownData[0]?.size;
      const type = removeDuplicates(
        shownData[0]?.disks?.map(({ type }) => type)
      );
      const isRaid = shownData[0]?.raidLabel != null;

      return toInfoTable(
        isRaid
          ? config.storage_label_list
          : config.storage_label_list.filter(x => x !== 'raid'),
        {
          brand: { label: 'Brand', value: brand },
          size: { label: 'Size', value: size ? bytePrettyPrint(size) : '' },
          type: { label: 'Type', value: type },
          raid: { label: 'Raid', value: shownData[0]?.raidLabel },
        }
      );
    }
  }, [config.storage_label_list, shownData]);

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      heading='Storage'
      infos={infos}
      infosPerPage={
        shownData.length > 1 ? config.storage_widget_items_per_page : 7
      }
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
