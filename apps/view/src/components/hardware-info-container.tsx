import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { useIsMobile } from '../services/mobile';
import { InfoTable, InfoTableProps } from './info-table';
import { ThemedText } from './text';

const Container = styled.div<{ mobile: boolean }>`
  position: relative;
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

const InfoHeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 30px 0 30px;
`;

const InfoHeading = styled(ThemedText)`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;

  svg {
    cursor: pointer;
    color: ${props => props.theme.colors.text};
  }
`;

const IconContainer = styled(motion.div)``;

type HardwareInfoProps = {
  color: string;
  heading: string;
  icon: IconProp;
  extraContent?: JSX.Element;
  children?: ReactNode;
  infosPerPage: number;
  onPageChange?: (page: number) => void;
} & InfoTableProps;

export const HardwareInfoContainer: FC<HardwareInfoProps> = props => {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(0);

  const changePage = (page: number) => {
    setPage(page);
    props.onPageChange?.(page);
  };

  return (
    <Container mobile={isMobile}>
      <InfoIcon {...props}>
        <FontAwesomeIcon icon={props.icon} size='2x' />
      </InfoIcon>

      <ContentContainer mobile={isMobile}>
        <InfoContainer>
          <InfoHeadingContainer>
            <InfoHeading>{props.heading}</InfoHeading>

            <Controls>
              <AnimatePresence>
                {page > 0 && (
                  <IconContainer layout>
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      onClick={() => changePage(page - 1)}
                    />
                  </IconContainer>
                )}
                {(page + 1) * props.infosPerPage < props.infos.length && (
                  <IconContainer layout>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      onClick={() => changePage(page + 1)}
                    />
                  </IconContainer>
                )}
              </AnimatePresence>
            </Controls>
          </InfoHeadingContainer>

          <InfoTable
            infos={props.infos}
            page={page}
            itemsPerPage={props.infosPerPage}
          />
        </InfoContainer>

        {props.extraContent}

        {props.children}
      </ContentContainer>
    </Container>
  );
};
