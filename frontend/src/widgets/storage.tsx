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
  override?: Config['override'];
};

const StorageWidget: FC<StorageWidgetProps> = ({
  load,
  loading,
  data,
  override,
}) => {
  const theme = useTheme();

  let infos: { label: string; value?: string }[];

  if (data?.layout && data.layout.length > 1) {
    infos = data.layout.map((s, i) => ({
      label: `Drive ${i + 1}`,
      value: `${s.vendor} ${s.type} (${byteToGb(s.size)})`,
    }));
  } else {
    const vendor = override?.storage_vendor_1 ?? data?.layout[0].vendor;
    const capacity = byteToGb(
      override?.storage_capacity_1 ?? data?.layout[0].size ?? 0
    );
    const type = override?.storage_type_1 ?? data?.layout[0].type;

    infos = [
      {
        label: 'Vendor',
        value: vendor,
      },
      {
        label: 'Capacity',
        value: capacity ? `${capacity} GB` : '',
      },
      {
        label: 'Type',
        value: type,
      },
    ];
  }

  const allCapacity =
    data?.layout.reduce((acc, s) => (acc = acc + s.size), 0) ?? 0;
  const available = allCapacity - (load ?? 0);

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
