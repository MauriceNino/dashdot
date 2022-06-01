import { Config, NetworkInfo, NetworkLoad } from '@dash/common';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { Datum } from '@nivo/line';
import { FC } from 'react';
import { Tooltip, YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { DefaultAreaChart } from '../components/chart-components';
import { ChartContainer } from '../components/chart-container';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { bpsPrettyPrint } from '../utils/calculations';

type NetworkWidgetProps = {
  load: NetworkLoad[];
  data?: NetworkInfo;
  config?: Config;
};

export const NetworkWidget: FC<NetworkWidgetProps> = ({
  load,
  data,
  config,
}) => {
  const theme = useTheme();
  const override = config?.override;

  const type = override?.network_type ?? data?.type;
  const speedUp = override?.network_speed_up ?? data?.speedUp;
  const speedDown = override?.network_speed_down ?? data?.speedDown;
  const interfaceSpeed =
    override?.network_interface_speed ?? data?.interfaceSpeed;

  const chartDataDown = load.map((load, i) => ({
    x: i,
    y: load.down,
  })) as Datum[];
  const chartDataUp = load.map((load, i) => ({
    x: i,
    y: load.up,
  })) as Datum[];

  const maxUp = Math.max(
    (speedUp ?? 0) / 8,
    ...chartDataUp.map(u => u.y as number)
  );
  const maxDown = Math.max(
    (speedDown ?? 0) / 8,
    ...chartDataDown.map(d => d.y as number)
  );

  return (
    <HardwareInfoContainer
      columns={2}
      color={theme.colors.networkPrimary}
      heading='Network'
      infos={[
        {
          label: 'Type',
          value: type,
        },
        {
          label: 'Speed (Up)',
          value: speedUp ? bpsPrettyPrint(speedUp) : undefined,
        },
        {
          label: 'Speed (Down)',
          value: speedDown ? bpsPrettyPrint(speedDown) : undefined,
        },
        {
          label: 'Interface Speed',
          value: interfaceSpeed
            ? bpsPrettyPrint(interfaceSpeed * 1000 * 1000)
            : undefined,
        },
      ]}
      icon={faNetworkWired}
    >
      <ChartContainer
        contentLoaded={chartDataUp.length > 1}
        statText={`↑ ${bpsPrettyPrint(
          (chartDataUp[chartDataUp.length - 1]?.y ?? 0) as number
        )}`}
      >
        {size => (
          <DefaultAreaChart
            data={chartDataUp}
            height={size.height}
            width={size.width}
            color={theme.colors.networkPrimary}
          >
            <YAxis
              hide={true}
              type='number'
              domain={[maxUp * -0.1, maxUp * 1.1]}
            />
            <Tooltip
              content={x => (
                <ThemedText>
                  {bpsPrettyPrint((x.payload?.[0]?.value as number) * 8)}
                </ThemedText>
              )}
            />
          </DefaultAreaChart>
        )}
      </ChartContainer>

      <ChartContainer
        contentLoaded={chartDataDown.length > 1}
        statText={`↓ ${bpsPrettyPrint(
          (chartDataDown[chartDataDown.length - 1]?.y ?? 0) as number
        )}`}
      >
        {size => (
          <DefaultAreaChart
            data={chartDataDown}
            height={size.height}
            width={size.width}
            color={theme.colors.networkPrimary}
          >
            <YAxis
              hide={true}
              type='number'
              domain={[maxDown * -0.1, maxDown * 1.1]}
            />
            <Tooltip
              content={x => (
                <ThemedText>
                  {bpsPrettyPrint((x.payload?.[0]?.value as number) * 8)}
                </ThemedText>
              )}
            />
          </DefaultAreaChart>
        )}
      </ChartContainer>
    </HardwareInfoContainer>
  );
};
