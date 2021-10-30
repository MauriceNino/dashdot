import { faMemory } from "@fortawesome/free-solid-svg-icons";
import { RamInfo, RamLoad } from "dashdot-shared";
import { FC } from "react";
import { useTheme } from "styled-components";
import HardwareInfoContainer from "../components/hardware-info-container";
import { removeDuplicates } from "../utils/array-utils";
import { byteToGb } from "../utils/calculations";

type RamWidgetProps = {
  load: RamLoad[];
} & Partial<RamInfo>;

const RamWidget: FC<RamWidgetProps> = (props) => {
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
      chartData={[
        {
          id: "cpu",
          data: props.load.map((load, i) => ({
            x: i,
            y: (byteToGb(load) / byteToGb(props.total ?? 1)) * 100,
          })),
        },
      ]}
      heading="Memory"
      infos={[
        {
          label: "Brand" + (memCount > 1 ? "(s)" : ""),
          value: manufacturer,
        },
        {
          label: "Size",
          value: props.total ? `${byteToGb(props.total)} GB` : "",
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
