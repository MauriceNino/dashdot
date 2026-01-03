import type { Transient } from '@dashdot/common';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { useIsMobile } from '../services/mobile';

type SCProps = Transient<
  Pick<GlassPaneProps, 'grow' | 'minWidth'> & { mobile: boolean }
>;

const Container = styled.div<SCProps>`
  min-width: ${({ $minWidth, $mobile }) => ($mobile ? 0 : $minWidth)}px;
  width: ${({ $mobile }) => ($mobile ? '100%' : 'unset')};
  min-height: 360px;
  max-height: ${({ $mobile }) => ($mobile ? 'unset' : '500px')};

  flex-grow: ${({ $grow }) => $grow ?? 1};
  flex-basis: ${({ $mobile }) => ($mobile ? 'unset' : '0')};
  transition: opacity 0.3 ease-in-out;

  display: flex;
  backdrop-filter: blur(20px);
  background-color: ${({ theme }) => theme.colors.surface}44;
  border-radius: 25px;
  border: 1px solid ${({ theme }) => theme.colors.text}33;
`;

type GlassPaneProps = {
  grow?: number;
  minWidth?: number;
  enableTilt?: boolean;
  children?: React.ReactNode;
};

export const GlassPane = motion(
  forwardRef<HTMLDivElement, GlassPaneProps>((props, ref) => {
    const isMobile = useIsMobile();

    return (
      <Container
        ref={ref}
        $mobile={isMobile}
        $grow={props.grow ?? 1}
        $minWidth={props.minWidth ?? 350}
      >
        {props.children}
      </Container>
    );
  }),
);
