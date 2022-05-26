import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import styled from 'styled-components';
import { useIsMobile } from '../services/mobile';
import InfoTable, { InfoTableProps } from './info-table';
import ThemedText from './text';

const Container = styled.div<{ mobile: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentContainer = styled.div<{ mobile: boolean }>`
  display: flex;
  flex-direction: ${({ mobile }) => (mobile ? 'column-reverse' : 'row')};
  flex: 1 1 auto;
  ${({ mobile }) => mobile && 'padding: 20px 0'};
`;

const ChartArea = styled.div<{ mobile: boolean }>`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  ${({ mobile }) => mobile && `height: 270px;`}

  > div {
    display: flex;
    gap: 20px;

    height: ${({ mobile }) => (mobile ? '100%' : '110%')};
    width: 100%;

    position: ${({ mobile }) => (mobile ? 'relative' : 'absolute')};
    bottom: ${({ mobile }) => (mobile ? '0' : '-10px')};
    right: -10px;
  }
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
  min-height: 100px;

  position: relative;
  top: -10px;
  left: 20px;

  background-color: ${props => props.color};
  border-radius: 10px;
  box-shadow: 13px 13px 35px 0px rgba(0, 0, 0, 0.15);

  transition: background-color 0.5s ease;

  svg {
    color: ${props => props.theme.colors.text};
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
  infosLoading: boolean;
  children?: React.ReactNode;
} & InfoTableProps;

const HardwareInfoContainer: FC<HardwareInfoProps> = props => {
  const isMobile = useIsMobile();

  return (
    <>
      <Container mobile={isMobile}>
        <InfoIcon {...props}>
          <FontAwesomeIcon icon={props.icon} size='2x' />
        </InfoIcon>

        <ContentContainer mobile={isMobile}>
          <InfoContainer>
            <InfoHeading>{props.heading}</InfoHeading>

            <InfoTable infosLoading={props.infosLoading} infos={props.infos} />
          </InfoContainer>

          {props.extraContent}

          <ChartArea mobile={isMobile}>
            <div>{props.children}</div>
          </ChartArea>
        </ContentContainer>
      </Container>
    </>
  );
};

export default HardwareInfoContainer;
