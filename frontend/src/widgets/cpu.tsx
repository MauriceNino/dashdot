import { faMicrochip } from "@fortawesome/free-solid-svg-icons";
//@ts-ignore
import { linearGradientDef } from "@nivo/core";
import { Datum, ResponsiveLine } from "@nivo/line";
import { Switch } from "antd";
import { CpuInfo, CpuLoad } from "dashdot-shared";
import { FC } from "react";
import styled, { useTheme } from "styled-components";
import HardwareInfoContainer from "../components/hardware-info-container";
import ThemedText from "../components/text";

const CpuSwitchContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  z-index: 2;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

type CpuWidgetProps = {
  load: CpuLoad[];
} & Partial<CpuInfo>;

const CpuWidget: FC<CpuWidgetProps> = (props) => {
  const theme = useTheme();

  const chartData: Datum[] = props.load.reduce((acc, curr, i) => {
    const avgLoad =
      curr.reduce((acc, curr) => acc + curr.load, 0) / curr.length;

    acc.push({
      x: i,
      y: avgLoad,
    });
    return acc;
  }, [] as Datum[]);

  return (
    <HardwareInfoContainer
      color={theme.colors.cpuPrimary}
      contentLoaded={chartData.length > 1}
      heading="Processor"
      infos={[
        {
          label: "Brand",
          value: props.manufacturer,
        },
        {
          label: "Model",
          value: props.brand,
        },
        {
          label: "Cores",
          value: props.cores?.toString(),
        },
        {
          label: "Threads",
          value: props.threads?.toString(),
        },
        {
          label: "Frequency",
          value: props.speed ? `${props.speed} GHz` : "",
        },
      ]}
      icon={faMicrochip}
      extraContent={
        <CpuSwitchContainer>
          <ThemedText>Show All Cores</ThemedText>
          <Switch defaultChecked={false} onChange={() => {}} />
        </CpuSwitchContainer>
      }
    >
      <ResponsiveLine
        isInteractive={true}
        enableSlices="x"
        sliceTooltip={(props) => {
          const point = props.slice.points[0];
          return (
            <ThemedText>
              {Math.round((point.data.y as number) * 100) / 100} %
            </ThemedText>
          );
        }}
        data={[
          {
            id: "cpu",
            data: chartData,
          },
        ]}
        curve="monotoneX"
        enablePoints={false}
        animate={false}
        enableGridX={false}
        enableGridY={false}
        yScale={{
          type: "linear",
          min: 0,
          max: 100,
        }}
        enableArea={true}
        defs={[
          linearGradientDef("gradientA", [
            { offset: 0, color: "inherit" },
            { offset: 100, color: "inherit", opacity: 0 },
          ]),
        ]}
        fill={[{ match: "*", id: "gradientA" }]}
        colors={theme.colors.cpuPrimary}
      />
    </HardwareInfoContainer>
  );
};

export default CpuWidget;
