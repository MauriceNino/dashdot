import { FC } from 'react';
import { SwapSpinner } from 'react-spinners-kit';
import styled, { useTheme } from 'styled-components';
import { useIsMobile } from '../services/mobile';

const Container = styled.div<{
  mobile: boolean;
  edges: [boolean, boolean, boolean, boolean];
}>`
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
    position: absolute;
    border-radius: ${({ edges: [top, right, bottom, left] }) =>
      `${top ? '25px' : '10px'} ${right ? '25px' : '10px'} ${
        bottom ? '25px' : '10px'
      } ${left ? '25px' : '10px'}`};
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

type ChartContainerProps = {
  contentLoaded: boolean;
  edges?: [boolean, boolean, boolean, boolean];
  children: React.ReactNode;
};

export const ChartContainer: FC<ChartContainerProps> = props => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Container
      mobile={isMobile}
      edges={props.edges ?? [true, true, true, true]}
    >
      {props.contentLoaded ? (
        props.children
      ) : (
        <SwapSpinner size={70} color={theme.colors.background} loading={true} />
      )}
    </Container>
  );
};
