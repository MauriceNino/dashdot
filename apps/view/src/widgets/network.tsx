import { Config, NetworkInfo, NetworkLoad } from '@dash/common';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';
import { YAxis } from 'recharts';
import { useTheme } from 'styled-components';
import { DefaultAreaChart } from '../components/chart-components';
import {
  ChartContainer,
  MultiChartContainer,
} from '../components/chart-container';
import { HardwareInfoContainer } from '../components/hardware-info-container';
import { useIsMobile } from '../services/mobile';
import { bpsPrettyPrint } from '../utils/calculations';
import { toInfoTable } from '../utils/format';
import { ChartVal } from '../utils/types';

type NetworkChartProps = {
  load: NetworkLoad[];
  data: NetworkInfo;
  config: Config;
  showPercentages: boolean;
};

export const NetworkChart: FC<NetworkChartProps> = ({
  load,
  data,
  config,
  showPercentages,
}) => {
  const theme = useTheme();

  const override = config.override;
  const speedUp = override.network_speed_up ?? data.speedUp;
  const speedDown = override.network_speed_down ?? data.speedDown;

  const chartDataDown = load.map((load, i) => ({
    x: i,
    y: load.down,
  })) as ChartVal[];
  const chartDataUp = load.map((load, i) => ({
    x: i,
    y: load.up,
  })) as ChartVal[];

  const maxUp = Math.max(
    (speedUp ?? 0) / 8,
    ...chartDataUp.map(u => u.y as number)
  );
  const maxDown = Math.max(
    (speedDown ?? 0) / 8,
    ...chartDataDown.map(d => d.y as number)
  );

  return (
    <MultiChartContainer columns={2}>
      <ChartContainer
        contentLoaded={chartDataUp.length > 1}
        textLeft={
          showPercentages
            ? `↑ ${bpsPrettyPrint(
                ((chartDataUp[chartDataUp.length - 1]?.y as number) ?? 0) * 8
              )}`
            : '↑'
        }
        renderChart={size => (
          <DefaultAreaChart
            data={chartDataUp}
            height={size.height}
            width={size.width}
            color={theme.colors.networkPrimary}
            renderTooltip={val =>
              bpsPrettyPrint((val.payload?.[0]?.value ?? 0) * 8)
            }
          >
            <YAxis
              hide={true}
              type='number'
              domain={[maxUp * -0.1, maxUp * 1.1]}
            />
          </DefaultAreaChart>
        )}
      ></ChartContainer>

      <ChartContainer
        contentLoaded={chartDataDown.length > 1}
        textLeft={
          showPercentages
            ? `↓ ${bpsPrettyPrint(
                ((chartDataDown[chartDataDown.length - 1]?.y as number) ?? 0) *
                  8
              )}`
            : '↓'
        }
        renderChart={size => (
          <DefaultAreaChart
            data={chartDataDown}
            height={size.height}
            width={size.width}
            color={theme.colors.networkPrimary}
            renderTooltip={val =>
              bpsPrettyPrint((val.payload?.[0]?.value ?? 0) * 8)
            }
          >
            <YAxis
              hide={true}
              type='number'
              domain={[maxDown * -0.1, maxDown * 1.1]}
            />
          </DefaultAreaChart>
        )}
      ></ChartContainer>
    </MultiChartContainer>
  );
};

type NetworkWidgetProps = {
  load: NetworkLoad[];
  data: NetworkInfo;
  config: Config;
};

export const NetworkWidget: FC<NetworkWidgetProps> = ({
  load,
  data,
  config,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const override = config.override;

  const type = override.network_type ?? data.type;
  const speedUp = override.network_speed_up ?? data.speedUp;
  const speedDown = override.network_speed_down ?? data.speedDown;
  const interfaceSpeed =
    override.network_interface_speed ?? data.interfaceSpeed;
  const publicIp = override.network_public_ip ?? data.publicIp;

  return (
    <HardwareInfoContainer
      color={theme.colors.networkPrimary}
      heading='Network'
      infos={toInfoTable(
        config.network_label_list,
        {
          type: 'Type',
          speed_up: 'Speed (Up)',
          speed_down: 'Speed (Down)',
          interface_speed: 'Interface Speed',
          public_ip: 'Public IP',
        },
        [
          {
            key: 'type',
            value: type,
          },
          {
            key: 'speed_up',
            value: speedUp ? bpsPrettyPrint(speedUp) : undefined,
          },
          {
            key: 'speed_down',
            value: speedDown ? bpsPrettyPrint(speedDown) : undefined,
          },
          {
            key: 'interface_speed',
            value: interfaceSpeed
              ? bpsPrettyPrint(interfaceSpeed * 1000 * 1000)
              : undefined,
          },
          {
            key: 'public_ip',
            value: publicIp,
          },
        ]
      )}
      infosPerPage={7}
      icon={faNetworkWired}
    >
      <NetworkChart
        showPercentages={config.always_show_percentages || isMobile}
        load={load}
        data={data}
        config={config}
      />
    </HardwareInfoContainer>
  );
};
