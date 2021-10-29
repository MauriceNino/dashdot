import { faMemory } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { useTheme } from "styled-components";
import HardwareInfoContainer from "../components/hardware-info-container";

const RamWidget: FC = () => {
  const theme = useTheme();

  return (
    <HardwareInfoContainer
      color={theme.colors.ramPrimary}
      chartData={[]}
      heading="Memory"
      infos={[
        {
          label: "Brand",
          value: "G.Skill",
        },
        {
          label: "Size",
          value: "16GB",
        },
        {
          label: "Type",
          value: "DDR4",
        },
        {
          label: "Speed",
          value: "2133",
        },
      ]}
      icon={faMemory}
    />
  );
};

export default RamWidget;
