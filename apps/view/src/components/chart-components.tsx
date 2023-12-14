import { clamp } from '@dash/common';
import { motion } from 'framer-motion';
import { FC, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  BarChart,
  LabelProps,
  Pie,
  PieChart,
  Sector,
  SectorProps,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import styled, { useTheme } from 'styled-components';
import { throttle } from 'throttle-debounce';
import { ChartVal } from '../utils/types';
import { ThemedText } from './text';

type DefaultAreaChartProps = {
  height: number;
  width: number;
  color: string;
  children: React.ReactNode;
  data: ChartVal[];
  renderTooltip?: (point: TooltipProps<number, string>) => React.ReactNode;
};

export const DefaultAreaChart: FC<DefaultAreaChartProps> = ({
  data,
  height,
  width,
  color,
  renderTooltip,
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
      {renderTooltip && (
        <Tooltip<number, string>
          content={x => <ThemedText>{renderTooltip(x)}</ThemedText>}
          wrapperStyle={{ outline: 'none' }}
        />
      )}
      {children}
    </AreaChart>
  );
};

const HoverLabel = styled(motion.p)`
  color: ${props => props.theme.colors.text};
  position: absolute;
  z-index: 999;
  pointer-events: none;
  white-space: pre;
  text-align: center;
  line-height: 1.4;
`;

const getCoords = (
  pos: { x: number; y: number },
  parent: { width: number; height: number },
  label: { width: number; height: number }
): { top: number; left: number } => {
  const { width: parentWidth, height: parentHeight } = parent;
  const { width: labelWidth, height: labelHeight } = label;
  const { x, y } = pos;

  const topBottomOffset = labelHeight * (y > parentHeight / 2 ? -1 : 1) + 10;
  const top = y - labelHeight / 2 + topBottomOffset;
  const left = x - labelWidth / 2;

  if (top < 0) {
    return { top: 10, left };
  }
  if (top + labelHeight > parentHeight) {
    return { top: parentHeight - labelHeight - 10, left };
  }
  if (left < 0) {
    return { top, left: 10 };
  }
  if (left + labelWidth > parentWidth) {
    return { top, left: parentWidth - labelWidth - 10 };
  }

  return { top, left };
};
const renderActiveShape = (props: SectorProps & { outerRadius: number }) => {
  return <Sector {...props} outerRadius={props.outerRadius * 1.08} />;
};

let globalId = 0;
type DefaultPieChartProps = {
  height: number;
  width: number;
  color: string;
  children: React.ReactNode;
  data: {
    name: string;
    value: number;
  }[];
  hoverLabelRenderer: (label: string, value: number) => string;
};
export const DefaultPieChart: FC<DefaultPieChartProps> = ({
  data,
  height,
  width,
  color,
  children,
  hoverLabelRenderer,
}) => {
  const id = useMemo(() => {
    return `pie-chart-${++globalId}`;
  }, []);
  const theme = useTheme();

  const labelRef = useRef<HTMLParagraphElement>(null);

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
  const throttledSetLabel = useMemo(
    () => throttle(100, setLabel, { noTrailing: true }),
    []
  );

  const minSize = Math.min(height, width);
  const labelWidth = labelRef.current?.offsetWidth || 120;
  const labelHeight = labelRef.current?.offsetHeight || 50;

  const coords = label
    ? getCoords(
        label,
        { width, height },
        { width: labelWidth, height: labelHeight }
      )
    : undefined;

  return (
    <>
      {label && (
        <HoverLabel
          ref={labelRef}
          initial={{ ...coords, opacity: 0 }}
          animate={{
            ...coords,
            opacity: 1,
            transition: {
              duration: 0.3,
            },
          }}
        >
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
            const value = data.payload.payload.value;

            throttledSetLabel({
              label: hoverLabelRenderer(label, value),
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }}
          activeShape={renderActiveShape}
          labelLine={false}
        >
          {children}
        </Pie>
      </PieChart>
    </>
  );
};

const ToolTipContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const VertBarStartLabel: FC<
  LabelProps & {
    labelRenderer: (value: number) => string;
  }
> = props => {
  const theme = useTheme();

  return (
    <text
      x={props.x}
      y={(props.y as number) + (props.height as number) / 2}
      width={props.width}
      height={props.height}
      offset={props.offset}
      className='recharts-text recharts-label'
      text-anchor='start'
      fill={theme.colors.text}
    >
      <tspan x={(props.x as number) + (props.offset as number)} dy='0.355em'>
        {props.labelRenderer(props.value as number)}
      </tspan>
    </text>
  );
};

type DefaultVertBarChartProps = {
  height: number;
  width: number;
  children: React.ReactNode;
  data: {
    used: number;
    available: number;
  }[];
  tooltipRenderer: (
    value: TooltipProps<string | number | (string | number)[], string | number>
  ) => React.ReactNode;
};

export const DefaultVertBarChart: FC<DefaultVertBarChartProps> = ({
  data,
  height,
  width,
  children,
  tooltipRenderer,
}) => {
  const barSize = clamp(height / data.length - 20, 10, 60);
  const gap = (data.length - 1) * 10;
  const allBars = barSize * data.length;
  const margin = (height - gap - allBars) / 2;

  return (
    <BarChart
      data={data}
      height={height}
      width={width}
      layout={'vertical'}
      margin={{
        top: margin,
        bottom: data.length === 1 ? margin / 2 : margin,
        right: 20,
        left: 20,
      }}
      barSize={barSize}
    >
      <XAxis type='number' hide />
      <YAxis type='category' hide />

      <Tooltip
        cursor={false}
        content={x => <ToolTipContainer>{tooltipRenderer(x)}</ToolTipContainer>}
        wrapperStyle={{ outline: 'none' }}
      />
      {children}
    </BarChart>
  );
};
