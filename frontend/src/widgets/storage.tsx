import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { ResponsivePie } from '@nivo/pie';
import { Config, StorageInfo, StorageLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { removeDuplicates } from '../utils/array-utils';
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

  const size =
    override?.storage_capacity ??
    data?.layout?.reduce((acc, cur) => acc + cur.size, 0);
  const name = removeDuplicates(
    override?.storage_model
      ? [override?.storage_model]
      : data?.layout?.map(l => l.name)
  );
  const type = removeDuplicates(
    override?.storage_type
      ? [override?.storage_type]
      : data?.layout?.map(l => l.type)
  );

  const available = (size ?? 0) - (load ?? 0);

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      contentLoaded={load != null}
      heading='Storage'
      infosLoading={loading}
      infos={[
        {
          label: 'Model' + (name.length > 1 ? '(s)' : ''),
          value: name.join(', '),
        },
        {
          label: 'Capacity',
          value: size ? `${byteToGb(size)} GB` : '',
        },
        {
          label: 'Type' + (type.length > 1 ? '(s)' : ''),
          value: type.join(''),
        },
      ]}
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
