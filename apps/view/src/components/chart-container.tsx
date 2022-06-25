import { motion } from 'framer-motion';
import { forwardRef, ReactElement } from 'react';
import { SwapSpinner } from 'react-spinners-kit';
import ReactVirtualizedAutoSizer from 'react-virtualized-auto-sizer';
import styled, { useTheme } from 'styled-components';
import { useIsMobile } from '../services/mobile';

type ContainerProps = {
  mobile: boolean;
  edges: [boolean, boolean, boolean, boolean];
  loading: boolean;
};
const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;

  min-width: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ edges: [top, right, bottom, left] }) =>
    `${top ? '25px' : '10px'} ${right ? '25px' : '10px'} ${
      bottom ? '25px' : '10px'
    } ${left ? '25px' : '10px'}`};
  z-index: auto;

  transition: background-color 0.3s ease;
  align-items: center;
  justify-content: center;

  > div {
    overflow: hidden;
    ${({ edges: [top, right, bottom, left], loading }) =>
      !loading &&
      `
    position: absolute;
    border-radius: ${`${top ? '25px' : '10px'} ${right ? '25px' : '10px'} ${
      bottom ? '25px' : '10px'
    } ${left ? '25px' : '10px'}`};
    `}
  }

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: inherit;
    box-shadow: -13px -13px 35px 0px rgba(0, 0, 0, 0.15);
    z-index: -1;
  }
`;

const StatText = styled.p<{ float: 'left' | 'right' }>`
  position: absolute;
  top: 25px;
  ${({ float }) => (float === 'left' ? 'left: 25px' : 'right: 25px')};
  z-index: 2;
  color: ${({ theme }) => theme.colors.text}AA;
  white-space: nowrap;
`;

type ChartContainerProps = {
  contentLoaded: boolean;
  edges?: [boolean, boolean, boolean, boolean];
  textLeft?: string;
  textRight?: string;
  children: (size: { width: number; height: number }) => React.ReactNode;
};

export const ChartContainer = motion(
  forwardRef<HTMLDivElement, ChartContainerProps>((props, ref) => {
    const theme = useTheme();
    const isMobile = useIsMobile();

    return (
      <Container
        ref={ref}
        mobile={isMobile}
        edges={props.edges ?? [true, true, true, true]}
        loading={!props.contentLoaded}
      >
        {props.contentLoaded ? (
          <>
            <StatText float='left'>{props.textLeft}</StatText>
            <StatText float='right'>{props.textRight}</StatText>
            <ReactVirtualizedAutoSizer
              style={{
                height: '100%',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              {props.children}
            </ReactVirtualizedAutoSizer>
          </>
        ) : (
          <SwapSpinner
            size={70}
            color={theme.colors.background}
            loading={true}
          />
        )}
      </Container>
    );
  })
);

type MultiChartContainerProps = {
  columns?: number;
  gap?: number;
  children: ReactElement | ReactElement[];
};

export const SMultiChartContainer = styled.div<
  Omit<MultiChartContainerProps, 'children'> & { mobile: boolean }
>`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  ${({ mobile }) => mobile && `height: 270px;`}

  > div {
    display: grid;
    grid-template-columns: repeat(${({ columns }) => columns ?? 1}, 1fr);
    grid-auto-flow: row;
    gap: ${({ gap }) => gap ?? 20}px;
    justify-items: stretch;
    align-items: stretch;

    height: ${({ mobile }) => (mobile ? '100%' : '110%')};
    width: 100%;

    position: ${({ mobile }) => (mobile ? 'relative' : 'absolute')};
    bottom: ${({ mobile }) => (mobile ? '0' : '-10px')};
    right: -10px;

    z-index: 1;
  }
`;

export const MultiChartContainer = motion(
  forwardRef<HTMLDivElement, MultiChartContainerProps>(
    ({ children, ...props }, ref) => {
      const isMobile = useIsMobile();

      return (
        <SMultiChartContainer {...props} mobile={isMobile} ref={ref}>
          <div>{children}</div>
        </SMultiChartContainer>
      );
    }
  )
);
