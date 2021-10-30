import { faMemory } from "@fortawesome/free-solid-svg-icons";
import { RamInfo } from "dashdot-shared";
import { FC } from "react";
import { useTheme } from "styled-components";
import HardwareInfoContainer from "../components/hardware-info-container";
import { removeDuplicates } from "../utils/array-utils";

const RamWidget: FC<Partial<RamInfo>> = (props) => {
  const theme = useTheme();

  const manufacturer = removeDuplicates(
    props.layout?.map((l) => l.manufacturer)
  ).join(", ");
  const type = removeDuplicates(props.layout?.map((l) => l.type)).join(", ");
  const clockSpeed = removeDuplicates(
    props.layout?.map((l) => l.clockSpeed)
  ).join(", ");

  const memCount = props.layout?.length ?? 0;

  return (
    <HardwareInfoContainer
      color={theme.colors.ramPrimary}
      chartData={[]}
      heading="Memory"
      infos={[
        {
          label: "Brand" + (memCount > 1 ? "(s)" : ""),
          value: manufacturer,
        },
        {
          label: "Size",
          value: props.total
            ? `${Math.round(props.total / 1000000000)} GB`
            : "",
        },
        {
          label: "Type" + (memCount > 1 ? "(s)" : ""),
          value: type,
        },
        {
          label: "Speed" + (memCount > 1 ? "(s)" : ""),
          value: clockSpeed,
        },
      ]}
      icon={faMemory}
    />
  );
};

export default RamWidget;
