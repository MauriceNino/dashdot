import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
//@ts-ignore
import { linearGradientDef } from '@nivo/core';
import { Datum, ResponsiveLine } from '@nivo/line';
import { Config, NetworkInfo, NetworkLoad } from 'dashdot-shared';
import { FC } from 'react';
import { useTheme } from 'styled-components';
import { ChartContainer } from '../components/chart-container';
import HardwareInfoContainer from '../components/hardware-info-container';
import ThemedText from '../components/text';
import { bpsPrettyPrint, bytePrettyPrint } from '../utils/calculations';

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

  const chartDataDown = load.map((load, i) => ({
    x: i,
    y: load.down,
  })) as Datum[];
  const chartDataUp = load.map((load, i) => ({
    x: i,
    y: load.up,
  })) as Datum[];

  return (
    <HardwareInfoContainer
      color={theme.colors.networkPrimary}
      heading='Network'
      infosLoading={loading}
      infos={[
        {
          label: 'Type',
          value: data?.type,
        },
        {
          label: 'Speed (Up)',
          value: data?.speedUp ? bpsPrettyPrint(data?.speedUp) : undefined,
        },
        {
          label: 'Speed (Down)',
          value: data?.speedDown ? bpsPrettyPrint(data?.speedDown) : undefined,
        },
        {
          label: 'Network Speed',
          value: data?.interfaceSpeed
            ? bpsPrettyPrint(data?.interfaceSpeed * 1000 * 1000)
            : undefined,
        },
      ]}
      icon={faNetworkWired}
    >
      <ChartContainer contentLoaded={chartDataUp.length > 1}>
        <ResponsiveLine
          isInteractive={true}
          enableSlices='x'
          sliceTooltip={props => {
            const point = props.slice.points[0];
            return (
              <ThemedText>{bytePrettyPrint(point.data.y as number)}</ThemedText>
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
          yScale={
            data?.speedUp
              ? {
                  type: 'linear',
                  min: (data.speedUp / 8) * -0.05,
                  max: data.speedUp / 8,
                }
              : undefined
          }
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
        <ResponsiveLine
          isInteractive={true}
          enableSlices='x'
          sliceTooltip={props => {
            const point = props.slice.points[0];
            return (
              <ThemedText>{bytePrettyPrint(point.data.y as number)}</ThemedText>
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
          yScale={
            data?.speedDown
              ? {
                  type: 'linear',
                  min: (data.speedDown / 8) * -0.05,
                  max: data.speedDown / 8,
                }
              : undefined
          }
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
