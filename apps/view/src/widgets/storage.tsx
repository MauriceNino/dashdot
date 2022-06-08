import { Config, StorageInfo, StorageLoad } from '@dash/common';
import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';
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

  let infos: { label: string; value?: string }[];

  if (data.layout && data.layout.length > 1) {
    infos = data.layout.map((s, i) => {
      //@ts-ignore
      const brand = override[`storage_brand_${i + 1}`] ?? s.brand;
      //@ts-ignore
      const type = override[`storage_type_${i + 1}`] ?? s.type;
      //@ts-ignore
      const size = override[`storage_size_${i + 1}`] ?? s.size;

      return {
        label: `Drive ${i + 1}`,
        value: `${brand} ${type} (${bytePrettyPrint(size)})`,
      };
    });
  } else {
    const brand = override.storage_brand_1 ?? data.layout[0]?.brand;
    const size = override.storage_size_1 ?? data.layout[0]?.size;
    const type = override.storage_type_1 ?? data.layout[0]?.type;

    infos = toInfoTable(
      config.storage_label_list,
      {
        brand: 'Brand',
        size: 'Size',
        type: 'Type',
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
      ]
    );
  }

  const size = data.layout.reduce((acc, s) => (acc = acc + s.size), 0) ?? 0;
  const available = Math.max(size - (load ?? 0), 1);

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      heading='Storage'
      infos={infos}
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
