import { FC, useMemo, useState } from 'react';
import { Area, AreaChart, Pie, PieChart, Sector } from 'recharts';
import styled, { useTheme } from 'styled-components';
import ThemedText from './text';

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

const HoverLabel = styled(ThemedText)<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top - 40}px;
  left: ${props => props.left - 20}px;
  z-index: 999;
  pointer-events: none;
  transition: all 0.1s;
`;

const renderLabel = (
  { cx, cy, midAngle, innerRadius, outerRadius, payload }: any,
  theme: any,
  labelRenderer: (value: number) => string
) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const centerx = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const centery = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
  const value = payload.value;

  return value > 1 ? (
    <text
      x={centerx}
      y={centery}
      fill={theme.colors.text}
      textAnchor={'middle'}
      dominantBaseline='central'
      style={{
        pointerEvents: 'none',
      }}
    >
      {labelRenderer(value)}
    </text>
  ) : null;
};

const renderActiveShape = (props: any) => {
  return <Sector {...props} outerRadius={props.outerRadius * 1.08} />;
};

let globalId = 0;
type DefaultPieChartProps = {
  height: number;
  width: number;
  color: string;
  children: React.ReactNode;
  data: any[];
  labelRenderer: (value: number) => string;
};
export const DefaultPieChart: FC<DefaultPieChartProps> = ({
  data,
  height,
  width,
  color,
  children,
  labelRenderer,
}) => {
  const id = useMemo(() => {
    return `pie-chart-${++globalId}`;
  }, []);
  const theme = useTheme();

  const [activeSegment, setActiveSegment] = useState<number | undefined>(
    undefined
  );
  const [label, setLabel] = useState<
    | {
        label: string;
        x: number;
        y: number;
      }
    | undefined
  >(undefined);

  const minSize = Math.min(height, width);

  return (
    <>
      {label && (
        <HoverLabel top={label.y} left={label.x}>
          {label.label}
        </HoverLabel>
      )}
      <PieChart id={id} width={width} height={height}>
        <Pie
          data={data}
          isAnimationActive={false}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={minSize / 2 - 30 - minSize / 4.5}
          outerRadius={minSize / 2 - 30}
          cornerRadius={minSize / 18}
          paddingAngle={0}
          fill={color}
          strokeWidth={5}
          stroke={theme.colors.surface}
          activeIndex={activeSegment}
          onMouseEnter={(_, i) => {
            setActiveSegment(i);
          }}
          onMouseLeave={() => {
            setActiveSegment(undefined);
            setLabel(undefined);
          }}
          onMouseMove={(data, _, event) => {
            const rect = (
              document.querySelector(`#${id}`) as HTMLElement
            ).getBoundingClientRect();
            const label = data.payload.payload.name;

            setLabel({
              label,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }}
          activeShape={renderActiveShape}
          labelLine={false}
          label={props => renderLabel(props, theme, labelRenderer)}
        >
          {children}
        </Pie>
      </PieChart>
    </>
  );
};
