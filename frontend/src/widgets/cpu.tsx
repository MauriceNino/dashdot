import { faMicrochip } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "antd";
import { CpuInfo } from "dashdot-shared";
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

const CpuWidget: FC<Partial<CpuInfo>> = (props) => {
  const theme = useTheme();

  return (
    <HardwareInfoContainer
      color={theme.colors.cpuPrimary}
      chartData={[]}
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
    />
  );
};

export default CpuWidget;
