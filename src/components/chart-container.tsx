import { FC } from "react";
import ParallaxTilt from "react-parallax-tilt";
import styled from "styled-components";

const Container = styled(ParallaxTilt)<Pick<ChartContainerProps, "grow">>`
  min-width: 400px;
  min-height: 300px;
  height: calc(45vh - 10px);
  margin: 5px;

  flex-basis: calc(${(props) => (props.grow ?? 1) * 33}% - 10px);
  flex-grow: 1;

  backdrop-filter: blur(20px);
  background-color: ${({ theme }) => theme.colors.background}44;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.text}33;

  &:hover {
    z-index: 2;
  }
`;

type ChartContainerProps = {
  grow?: number;
};

const ChartContainer: FC<ChartContainerProps> = (props) => {
  return (
    <Container tiltMaxAngleX={4} tiltMaxAngleY={4} grow={props.grow ?? 1}>
      {props.children}
    </Container>
  );
};

export default ChartContainer;
