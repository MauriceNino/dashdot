import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { useTheme } from "styled-components";
import HardwareInfoContainer from "../components/hardware-info-container";

const StorageWidget: FC = () => {
  const theme = useTheme();
  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      chartData={[]}
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
    />
  );
};

export default StorageWidget;
