import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { ResponsivePie } from '@nivo/pie';
import { Config, StorageInfo, StorageLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { byteToGb } from '../utils/calculations';

type StorageWidgetProps = {
  load?: StorageLoad;
  loading: boolean;
  data?: StorageInfo;
  config?: Config;
};

const StorageWidget: FC<StorageWidgetProps> = ({
  load,
  loading,
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

      console.log(override);

      return {
        label: `Drive ${i + 1}`,
        value: `${brand} ${type} (${byteToGb(size)} GB)`,
      };
    });
  } else {
    const brand = override?.storage_brand_1 ?? data?.layout[0]?.brand;
    const size = byteToGb(
      override?.storage_size_1 ?? data?.layout[0]?.size ?? 0
    );
    const type = override?.storage_type_1 ?? data?.layout[0]?.type;

    infos = [
      {
        label: 'Brand',
        value: brand,
      },
      {
        label: 'Size',
        value: size ? `${size} GB` : '',
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
      contentLoaded={load != null}
      heading='Storage'
      infosLoading={loading}
      infos={infos}
      icon={faHdd}
    >
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
        margin={{ top: 40, bottom: 40 }}
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
        arcLabel={data => `${byteToGb(data.value)} GB`}
        colors={[theme.colors.storagePrimary, theme.colors.background]}
        tooltip={props => {
          const value = props.datum.value;
          return (
            <ThemedText>
              {props.datum.id}: {byteToGb(value)} GB
            </ThemedText>
          );
        }}
      />
    </HardwareInfoContainer>
  );
};

export default StorageWidget;
