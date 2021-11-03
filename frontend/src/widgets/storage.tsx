import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { ResponsivePie } from '@nivo/pie';
import { StorageInfo, StorageLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { removeDuplicates } from '../utils/array-utils';
import { byteToGb } from '../utils/calculations';

type StorageWidgetProps = {
  load?: StorageLoad;
} & Partial<StorageInfo>;

const StorageWidget: FC<StorageWidgetProps> = props => {
  const theme = useTheme();

  const size = props.layout?.reduce((acc, cur) => acc + cur.size, 0);
  const name = removeDuplicates(props.layout?.map(l => l.name));
  const type = removeDuplicates(props.layout?.map(l => l.type));

  const used = props.load;
  const available = (size ?? 0) - (used ?? 0);

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      contentLoaded={props.load != null}
      heading='Storage'
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
            value: used,
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
