import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Serie } from "@nivo/line";
import { FC } from "react";
import { SwapSpinner } from "react-spinners-kit";
import styled, { useTheme } from "styled-components";
import Chart from "./chart";
import InfoTable, { InfoTableProps } from "./info-table";
import ThemedText from "./text";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const ChartArea = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 80%;
  width: 100%;

  position: absolute;
  bottom: -10px;
  right: -10px;

  padding: 25px 0;

  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  box-shadow: -13px -13px 35px 0px rgba(0, 0, 0, 0.15);

  transition: background-color 0.3s ease;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 300px;
  min-width: 300px;
  flex-grow: 0 !important;
`;

const InfoIcon = styled.div<HardwareInfoProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;

  position: relative;
  top: -10px;
  left: 20px;

  background-color: ${(props) => props.color};
  border-radius: 10px;
  box-shadow: 13px 13px 35px 0px rgba(0, 0, 0, 0.15);

  transition: background-color 0.5s ease;

  svg {
    color: ${(props) => props.theme.colors.text};
  }
`;

const InfoHeading = styled(ThemedText)`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 30px 30px 10px 30px;
`;

type HardwareInfoProps = {
  color: string;
  heading: string;
  icon: IconProp;
  extraContent?: JSX.Element;
  chartData: Serie[];
} & InfoTableProps;

const HardwareInfoContainer: FC<HardwareInfoProps> = (props) => {
  const theme = useTheme();

  console.log(props.chartData);

  return (
    <Container>
      <InfoContainer>
        <InfoIcon {...props}>
          <FontAwesomeIcon icon={props.icon} size="2x" />
        </InfoIcon>

        <InfoHeading>{props.heading}</InfoHeading>

        <InfoTable infos={props.infos} />
      </InfoContainer>

      {props.extraContent}

      <ChartArea>
        <ChartContainer>
          {props.chartData.length > 0 && props.chartData[0].data.length > 1 ? (
            <Chart data={props.chartData} color={props.color} />
          ) : (
            <SwapSpinner
              size={70}
              color={theme.colors.background}
              loading={true}
            />
          )}
        </ChartContainer>
      </ChartArea>
    </Container>
  );
};

export default HardwareInfoContainer;
