import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { ResponsivePie } from '@nivo/pie';
import { Config, StorageInfo, StorageLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import { ChartContainer } from '../components/chart-container';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { bytePrettyPrint } from '../utils/calculations';

type StorageWidgetProps = {
  load?: StorageLoad;
  data?: StorageInfo;
  config?: Config;
};

export const StorageWidget: FC<StorageWidgetProps> = ({
  load,
  data,
  config,
}) => {
  const theme = useTheme();
  const override = config?.override;

  let infos: { label: string; value?: string }[];

  if (data?.layout && data.layout.length > 1) {
    infos = data.layout.map((s, i) => {
      //@ts-ignore
      const brand = override?.[`storage_brand_${i + 1}`] ?? s.brand;
      //@ts-ignore
      const type = override?.[`storage_type_${i + 1}`] ?? s.type;
      //@ts-ignore
      const size = override?.[`storage_size_${i + 1}`] ?? s.size;

      return {
        label: `Drive ${i + 1}`,
        value: `${brand} ${type} (${bytePrettyPrint(size)})`,
      };
    });
  } else {
    const brand = override?.storage_brand_1 ?? data?.layout[0]?.brand;
    const size = override?.storage_size_1 ?? data?.layout[0]?.size;
    const type = override?.storage_type_1 ?? data?.layout[0]?.type;

    infos = [
      {
        label: 'Brand',
        value: brand,
      },
      {
        label: 'Size',
        value: size ? bytePrettyPrint(size) : '',
      },
      {
        label: 'Type',
        value: type,
      },
    ];
  }

  const size = data?.layout.reduce((acc, s) => (acc = acc + s.size), 0) ?? 0;
  const available = size - (load ?? 0);

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      heading='Storage'
      infos={infos}
      icon={faHdd}
    >
      <ChartContainer contentLoaded={load != null}>
        <ResponsivePie
          data={[
            {
              id: 'Used',
              value: load,
            },
            {
              id: 'Free',
              value: available,
            },
          ]}
          margin={{ top: 40, bottom: 40, left: 40, right: 40 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={10}
          activeOuterRadiusOffset={8}
          arcLinkLabelsTextColor={theme.colors.text}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [[theme.dark ? 'brighter' : 'darker', 3]],
          }}
          arcLabel={data => bytePrettyPrint(data.value)}
          colors={[theme.colors.storagePrimary, theme.colors.background]}
          tooltip={props => {
            const value = props.datum.value;
            return (
              <ThemedText>
                {props.datum.id}: {bytePrettyPrint(value)}
              </ThemedText>
            );
          }}
        />
      </ChartContainer>
    </HardwareInfoContainer>
  );
};
