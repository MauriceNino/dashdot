import { faHdd } from "@fortawesome/free-solid-svg-icons";
import { StorageInfo } from "dashdot-shared";
import { FC } from "react";
import { useTheme } from "styled-components";
import HardwareInfoContainer from "../components/hardware-info-container";
import { removeDuplicates } from "../utils/array-utils";
import { byteToGb } from "../utils/calculations";

const StorageWidget: FC<Partial<StorageInfo>> = (props) => {
  const theme = useTheme();

  const size = props.layout?.reduce((acc, cur) => acc + cur.size, 0);
  const name = removeDuplicates(props.layout?.map((l) => l.name)).join(", ");
  const type = removeDuplicates(props.layout?.map((l) => l.type)).join(", ");

  const diskCount = props.layout?.length ?? 0;

  return (
    <HardwareInfoContainer
      color={theme.colors.storagePrimary}
      contentLoaded={false}
      heading="Storage"
      infos={[
        {
          label: "Model" + (diskCount > 1 ? "(s)" : ""),
          value: name,
        },
        {
          label: "Capacity",
          value: size ? `${byteToGb(size)} GB` : "",
        },
        {
          label: "Type" + (diskCount > 1 ? "(s)" : ""),
          value: type,
        },
      ]}
      icon={faHdd}
    />
  );
};

export default StorageWidget;
