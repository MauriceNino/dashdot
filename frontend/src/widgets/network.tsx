import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { linearGradientDef } from '@nivo/core';
import { Datum, ResponsiveLine } from '@nivo/line';
import { Config, NetworkInfo, NetworkLoad } from 'dashdot-shared';
import { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { ChartContainer } from '../components/chart-container';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { bpsPrettyPrint } from '../utils/calculations';

const ModeContainer = styled.div`
  position: absolute;
  left: 25px;
  top: 25px;
  z-index: 2;
  color: ${({ theme }) => theme.colors.text}AA;
`;

type NetworkWidgetProps = {
  load: NetworkLoad[];
  loading: boolean;
  data?: NetworkInfo;
  config?: Config;
};

export const NetworkWidget: FC<NetworkWidgetProps> = ({
  load,
  loading,
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
      color={theme.colors.networkPrimary}
      heading='Network'
      infosLoading={loading}
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
      <ChartContainer contentLoaded={chartDataUp.length > 1}>
        <ModeContainer>↑</ModeContainer>
        <ResponsiveLine
          isInteractive={true}
          enableSlices='x'
          sliceTooltip={props => {
            const point = props.slice.points[0];
            return (
              <ThemedText>
                {bpsPrettyPrint((point.data.y as number) * 8)}
              </ThemedText>
            );
          }}
          data={[
            {
              id: 'network-up',
              data: chartDataUp,
            },
          ]}
          curve='monotoneX'
          enablePoints={false}
          animate={false}
          enableGridX={false}
          enableGridY={false}
          yScale={{
            type: 'linear',
            min: maxUp * -0.1,
            max: maxUp * 1.1,
          }}
          enableArea={true}
          defs={[
            linearGradientDef('gradientA', [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0 },
            ]),
          ]}
          fill={[{ match: '*', id: 'gradientA' }]}
          colors={theme.colors.networkPrimary}
        />
      </ChartContainer>

      <ChartContainer contentLoaded={chartDataDown.length > 1}>
        <ModeContainer>↓</ModeContainer>
        <ResponsiveLine
          isInteractive={true}
          enableSlices='x'
          sliceTooltip={props => {
            const point = props.slice.points[0];
            return (
              <ThemedText>
                {bpsPrettyPrint((point.data.y as number) * 8)}
              </ThemedText>
            );
          }}
          data={[
            {
              id: 'network-down',
              data: chartDataDown,
            },
          ]}
          curve='monotoneX'
          enablePoints={false}
          animate={false}
          enableGridX={false}
          enableGridY={false}
          yScale={{
            type: 'linear',
            min: maxDown * -0.1,
            max: maxDown * 1.1,
          }}
          enableArea={true}
          defs={[
            linearGradientDef('gradientA', [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0 },
            ]),
          ]}
          fill={[{ match: '*', id: 'gradientA' }]}
          colors={theme.colors.networkPrimary}
        />
      </ChartContainer>
    </HardwareInfoContainer>
  );
};
