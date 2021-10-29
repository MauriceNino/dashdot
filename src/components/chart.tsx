//@ts-ignore
import { linearGradientDef } from "@nivo/core";
import { Datum, ResponsiveLine, Serie } from "@nivo/line";
import { FC, useEffect, useState } from "react";

const getRandomValue = (x: number, y: number = 50): Datum => {
  const rand = Math.random() * 20;
  const newY = y + (rand - (y < 50 ? 6 : 14));

  return {
    x: x,
    y: newY > 100 ? 100 : newY < 0 ? 0 : newY,
  };
};

const INITIAL_DATA: Serie[] = [
  {
    id: "1",
    data: new Array(20).fill(0).map((_, i) => getRandomValue(i)),
  },
];

type ChartProps = {
  color: string;
  data: Serie[];
};

const Chart: FC<ChartProps> = (props) => {
  const [data, setData] = useState<Serie[]>(INITIAL_DATA);

  useEffect(() => {
    const intervalHandle = setInterval(() => {
      setData((oldData) => {
        const oldValues = [...oldData[0].data];
        const lastOldValue = oldValues[oldValues.length - 1];
        if (oldValues.length > 20) {
          oldValues.shift();
        }

        const newData = [
          ...oldValues,
          getRandomValue(
            (lastOldValue.x as number) + 1,
            (lastOldValue.y as number) + 1
          ),
        ];

        return [
          {
            ...oldData[0],
            data: newData,
          },
        ];
      });
    }, 1000);

    return () => clearInterval(intervalHandle);
  }, []);

  return (
    <ResponsiveLine
      data={data}
      curve="monotoneX"
      enablePoints={false}
      isInteractive={false}
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
