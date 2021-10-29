import { faMemory } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import Chart from "../components/chart";
import HardwareInfoContainer from "../components/hardware-info-container";

const RamWidget: FC = () => {
  return (
    <HardwareInfoContainer
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
    >
      <Chart />
    </HardwareInfoContainer>
  );
};

export default RamWidget;
