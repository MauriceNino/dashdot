import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import styled from "styled-components";
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
  height: 80%;
  width: 100%;

  position: absolute;
  bottom: -10px;
  right: -10px;

  padding: 25px 0;

  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  box-shadow: -13px -13px 35px 0px rgba(0, 0, 0, 0.15);
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 300px;
  min-width: 300px;
  flex-grow: 0 !important;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;

  position: relative;
  top: -10px;
  left: 20px;

  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 10px;
  box-shadow: 13px 13px 35px 0px rgba(0, 0, 0, 0.15);

  svg {
    color: ${(props) => props.theme.colors.text};
  }
`;

const InfoHeading = styled(ThemedText)`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 30px 30px 10px 30px;
`;

const InfoTextContainer = styled.div`
  display: table;
  padding: 30px;
  color: ${(props) => props.theme.colors.text};
`;

const InfoTextRow = styled.div`
  display: table-row;
`;

const InfoTextLabel = styled(ThemedText)`
  display: table-cell;
  width: auto;
  font-size: 0.8rem;
  padding-bottom: 10px;
`;

const InfoTextValue = styled(ThemedText)`
  display: table-cell;
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 10px;
`;

type HardwareInfoProps = {
  heading: string;
  infos: {
    label: string;
    value: string;
  }[];
  icon: IconProp;
  extraContent?: JSX.Element;
};

const HardwareInfoContainer: FC<HardwareInfoProps> = (props) => {
  return (
    <Container>
      <InfoContainer>
        <InfoIcon>
          <FontAwesomeIcon icon={props.icon} size="2x" />
        </InfoIcon>

        <InfoHeading>{props.heading}</InfoHeading>

        <InfoTextContainer>
          {props.infos.map((info) => (
            <InfoTextRow key={info.label}>
              <InfoTextLabel>{info.label}</InfoTextLabel>
              <InfoTextValue>{info.value}</InfoTextValue>
            </InfoTextRow>
          ))}
        </InfoTextContainer>
      </InfoContainer>

      {props.extraContent}

      <ChartArea>
        <ChartContainer>{props.children}</ChartContainer>
      </ChartArea>
    </Container>
  );
};

export default HardwareInfoContainer;
