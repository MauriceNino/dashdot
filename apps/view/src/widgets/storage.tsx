import { Config, StorageInfo, StorageLoad } from '@dash/common';
import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { FC, useMemo } from 'react';
import { Cell } from 'recharts';
import { useTheme } from 'styled-components';
import { DefaultPieChart } from '../components/chart-components';
import { ChartContainer } from '../components/chart-container';
import { HardwareInfoContainer } from '../components/hardware-info-container';
import { bytePrettyPrint } from '../utils/calculations';
import { toInfoTable } from '../utils/format';

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
  const override = config.override;

  const layout = useMemo(
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
            });
          }

          return acc;
        },
        [] as {
          brands: string[];
          types: string[];
          size: number;
          raidGroup?: string;
        }[]
      ),
    [
      data.layout,
      override.storage_brands,
      override.storage_sizes,
      override.storage_types,
    ]
  );

  const infos = useMemo(() => {
    if (layout.length > 1) {
      return layout.map(s => {
        const brand = s.brands.map((b, i) => `${b} ${s.types[i]}`).join(', ');
        const size = s.size;
        const raidGroup = s.raidGroup;

        return {
          label: raidGroup ? `RAID\n=> ${raidGroup}` : 'Drive',
          value: `${brand}\n=> ${bytePrettyPrint(size)}`,
        };
      });
    } else {
      const brand = layout[0].brands.join(', ');
      const size = layout[0].size;
      const type = layout[0].types.join(', ');
      const isRaid = layout[0].raidGroup != null;

      return toInfoTable(
        isRaid
          ? config.storage_label_list
          : config.storage_label_list.filter(x => x !== 'raid'),
        {
          brand: layout[0].brands.length > 1 ? 'Brands' : 'Brand',
          size: 'Size',
          type: layout[0].types.length > 1 ? 'Types' : 'Type',
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
            value: layout[0].raidGroup,
          },
        ]
      );
    }
  }, [config.storage_label_list, layout]);

  const size = layout.reduce((acc, s) => (acc = acc + s.size), 0) ?? 0;
  const available = Math.max(size - (load ?? 0), 1);

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      heading='Storage'
      infos={infos}
      infosPerPage={layout.length > 1 ? 3 : 7}
      icon={faHdd}
    >
      <ChartContainer
        statText={`%: ${(((load ?? 0) / size) * 100).toFixed(1)}`}
        contentLoaded={load != null}
      >
        {size => (
          <DefaultPieChart
            data={[
              {
                name: 'Used',
                value: load,
              },
              {
                name: 'Free',
                value: available,
              },
            ]}
            width={size.width}
            height={size.height}
            color={theme.colors.storagePrimary}
            labelRenderer={val => bytePrettyPrint(val)}
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
      </ChartContainer>
    </HardwareInfoContainer>
  );
};
