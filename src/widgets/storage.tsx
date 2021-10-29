import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import Chart from "../components/chart";
import HardwareInfoContainer from "../components/hardware-info-container";

const StorageWidget: FC = () => {
  return (
    <HardwareInfoContainer
      heading="Storage"
      infos={[
        {
          label: "Brand",
          value: "Samsung",
        },
        {
          label: "Model",
          value: "T5",
        },
        {
          label: "Capacity",
          value: "512 GB",
        },
        {
          label: "Type",
          value: "SSD",
        },
        {
          label: "Speed",
          value: "5200 RPM",
        },
      ]}
      icon={faHdd}
    >
      <Chart />
    </HardwareInfoContainer>
  );
};

export default StorageWidget;
