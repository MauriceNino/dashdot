import { FC } from "react";
import ParallaxTilt from "react-parallax-tilt";
import styled from "styled-components";

const TiltContainer = styled(ParallaxTilt)<ChartContainerProps>`
  display: flex;
  min-width: 400px;
  min-height: 300px;
  height: calc(45vh - 30px);
  margin: 15px;

  flex-basis: calc(${(props) => (props.grow ?? 1) * 33}% - 60px);
  flex-grow: 1;

  backdrop-filter: blur(20px);
  background-color: ${({ theme }) => theme.colors.background}44;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.text}33;

  transform-style: preserve-3d;

  &:hover {
    z-index: 2;
  }
`;

type ChartContainerProps = {
  grow?: number;
};

const ChartContainer: FC<ChartContainerProps> = (props) => {
  return (
    <TiltContainer
      transitionSpeed={1500}
      tiltMaxAngleX={4}
      tiltMaxAngleY={4}
      grow={props.grow ?? 1}
      // perspective={1000}
    >
      {props.children}
    </TiltContainer>
  );
};

export default ChartContainer;
