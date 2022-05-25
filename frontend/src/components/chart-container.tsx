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
  box-shadow: -13px -13px 35px 0px rgba(0, 0, 0, 0.15);

  transition: background-color 0.3s ease;
  align-items: center;
  justify-content: center;
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
