import { FC } from 'react';
import { SwapSpinner } from 'react-spinners-kit';
import styled, { useTheme } from 'styled-components';
import { useIsMobile } from '../services/mobile';

const Container = styled.div<{ mobile: boolean }>`
  position: relative;
  display: flex;

  flex: 1 1 0;
  min-width: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 25px;
  z-index: auto;

  transition: background-color 0.3s ease;
  align-items: center;
  justify-content: center;

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
  children: React.ReactNode;
};

export const ChartContainer: FC<ChartContainerProps> = props => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Container mobile={isMobile}>
      {props.contentLoaded ? (
        props.children
      ) : (
        <SwapSpinner size={70} color={theme.colors.background} loading={true} />
      )}
    </Container>
  );
};
