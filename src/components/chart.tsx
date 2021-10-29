//@ts-ignore
import { linearGradientDef } from "@nivo/core";
import { Datum, ResponsiveLine, Serie } from "@nivo/line";
import { FC, useEffect, useState } from "react";

const getRandomValue = (x: number, y: number = 50): Datum => {
  const newY = y + (Math.random() * 20 - 11);
  return {
    x: x,
    y: newY > 100 ? 100 : newY < 0 ? 0 : newY,
  };
};

const Chart: FC = () => {
  const [data, setData] = useState<Serie[]>([
    {
      id: "1",
      data: new Array(20).fill(0).map((_, i) => getRandomValue(i)),
    },
  ]);

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
      isInteractive={false}
      animate={false}
      data={data}
      curve="monotoneX"
      enableGridX={false}
      enableGridY={false}
      enableArea={true}
      enablePoints={false}
      yScale={{
        type: "linear",
        min: 0,
        max: 100,
      }}
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradientA" }]}
    />
  );
};

export default Chart;
