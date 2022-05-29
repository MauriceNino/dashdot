import { FC } from 'react';
import { Area, AreaChart } from 'recharts';

type DefaultAreaChartProps = {
  height: number;
  width: number;
  color: string;
  children: React.ReactNode;
  data: any[];
};

export const DefaultAreaChart: FC<DefaultAreaChartProps> = ({
  data,
  height,
  width,
  color,
  children,
}) => {
  return (
    <AreaChart
      data={data}
      height={height}
      width={width}
      margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id={`gradient_${color}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={color} stopOpacity={0.2} />
          <stop offset='95%' stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type='monotone'
        dataKey='y'
        stroke={color}
        strokeWidth={3}
        fillOpacity={1}
        fill={`url(#${`gradient_${color}`})`}
        isAnimationActive={false}
      />
      {children}
    </AreaChart>
  );
};
