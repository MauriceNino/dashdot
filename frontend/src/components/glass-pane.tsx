import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { useIsMobile } from '../services/mobile';

type SCProps = GlassPaneProps & { mobile: boolean };

const TiltContainer = styled.div<SCProps>`
  position: relative;
  display: flex;
  min-width: ${({ minWidth, mobile }) => (mobile ? 0 : minWidth)}px;
  min-height: 360px;

  flex-grow: ${props => props.grow ?? 1};

  backdrop-filter: blur(20px);
  background-color: ${({ theme }) => theme.colors.surface}44;
  border-radius: 25px;
  border: 1px solid ${({ theme }) => theme.colors.text}33;

  &:hover {
    z-index: 2;
  }
`;

type GlassPaneProps = {
  grow?: number;
  minWidth?: number;
  enableTilt?: boolean;
  children?: React.ReactNode;
};

const GlassPane = motion(
  forwardRef<HTMLDivElement, GlassPaneProps>((props, ref) => {
    const isMobile = useIsMobile();

    return (
      <TiltContainer
        ref={ref}
        mobile={isMobile}
        // tiltEnable={props.enableTilt && !isMobile}
        // transitionSpeed={1500}
        // tiltMaxAngleX={4}
        // tiltMaxAngleY={4}
        grow={props.grow ?? 1}
        minWidth={props.minWidth ?? 350}
      >
        {props.children}
      </TiltContainer>
    );
  })
);

export default GlassPane;
