//@ts-ignore
import { linearGradientDef } from "@nivo/core";
import { ResponsiveLine, Serie } from "@nivo/line";
import { FC } from "react";
import ThemedText from "./text";

type ChartProps = {
  color: string;
  data: Serie[];
};

const Chart: FC<ChartProps> = (props) => {
  return (
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
      data={props.data}
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
      colors={props.color}
    />
  );
};

export default Chart;
